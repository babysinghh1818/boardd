from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
from datetime import datetime, timedelta
import bcrypt
import requests
import json
from functools import wraps

app = Flask(__name__)

# Hardcoded Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@localhost/test_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-this'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Exchange rate cache
exchange_rate_cache = {}
cache_timestamp = None

# Models
class GeneralUser(db.Model):
    __tablename__ = 'general_users'
    
    id = db.Column(db.Integer, primary_key=True)
    ids = db.Column(db.Text)
    role = db.Column(db.Enum('admin', 'user'), default='user')
    login_type = db.Column(db.Text)
    first_name = db.Column(db.Text)
    last_name = db.Column(db.Text)
    email = db.Column(db.Text)
    password = db.Column(db.Text)
    timezone = db.Column(db.Text)
    more_information = db.Column(db.Text)
    settings = db.Column(db.Text)
    descd = db.Column(db.Text)
    balance = db.Column(db.Numeric(15, 4), default=0.0000)
    affiliate_bal_available = db.Column(db.Numeric(15, 4), default=0.0000)
    affiliate_bal_transferred = db.Column(db.Numeric(15, 4), default=0.0000)
    custom_rate = db.Column(db.Integer, default=0)
    api_key = db.Column(db.String(191))
    affiliate_id = db.Column(db.String(191))
    referral_id = db.Column(db.String(191))
    spent = db.Column(db.String(225))
    activation_key = db.Column(db.Text)
    reset_key = db.Column(db.Text)
    history_ip = db.Column(db.Text)
    status = db.Column(db.Integer, default=1)
    changed = db.Column(db.DateTime)
    created = db.Column(db.DateTime)

class GeneralTransactionLog(db.Model):
    __tablename__ = 'general_transaction_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    ids = db.Column(db.Text)
    uid = db.Column(db.Integer)
    payer_email = db.Column(db.String(255))
    type = db.Column(db.Text)
    transaction_id = db.Column(db.Text)
    txn_fee = db.Column(db.Float)
    note = db.Column(db.Integer)
    data = db.Column(db.Text)
    amount = db.Column(db.Float)
    status = db.Column(db.Integer, default=1)
    created = db.Column(db.DateTime)

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    ids = db.Column(db.Text)
    type = db.Column(db.Enum('direct', 'api'), default='direct')
    cate_id = db.Column(db.String(191))
    service_id = db.Column(db.String(191))
    main_order_id = db.Column(db.Integer)
    service_type = db.Column(db.String(50), default='default')
    api_provider_id = db.Column(db.Integer)
    api_service_id = db.Column(db.String(200))
    api_order_id = db.Column(db.Integer, default=0)
    uid = db.Column(db.String(191))
    link = db.Column(db.String(191))
    quantity = db.Column(db.String(191))
    usernames = db.Column(db.Text)
    username = db.Column(db.Text)
    hashtags = db.Column(db.Text)
    hashtag = db.Column(db.Text)
    media = db.Column(db.Text)
    comments = db.Column(db.Text)
    sub_posts = db.Column(db.Integer)
    sub_min = db.Column(db.Integer)
    sub_max = db.Column(db.Integer)
    sub_delay = db.Column(db.Integer)
    sub_expiry = db.Column(db.Text)
    sub_response_orders = db.Column(db.Text)
    sub_response_posts = db.Column(db.Text)
    sub_status = db.Column(db.Enum('Active', 'Paused', 'Completed', 'Expired', 'Canceled'))
    charge = db.Column(db.Numeric(15, 4))
    formal_charge = db.Column(db.Numeric(15, 4))
    profit = db.Column(db.Numeric(15, 4))
    status = db.Column(db.Enum('active', 'completed', 'processing', 'inprogress', 'pending', 'partial', 'canceled', 'refunded', 'awaiting', 'error', 'fail'), default='pending')
    start_counter = db.Column(db.String(191))
    remains = db.Column(db.String(191), default='0')
    is_drip_feed = db.Column(db.Integer, default=0)
    runs = db.Column(db.Integer, default=0)
    interval_ = db.Column(db.Integer, default=0)
    dripfeed_quantity = db.Column(db.String(191), default='0')
    note = db.Column(db.Text)
    changed = db.Column(db.DateTime)
    created = db.Column(db.DateTime)

# Helper functions
def get_date_range(period, timezone='UTC'):
    """Get start and end dates based on period"""
    try:
        now = datetime.utcnow()
        
        if period == 'daily':
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
            end_date = now
        elif period == 'weekly':
            start_date = now - timedelta(days=7)
            end_date = now
        elif period == 'monthly':
            start_date = now - timedelta(days=30)
            end_date = now
        else:  # custom or default to weekly
            start_date = now - timedelta(days=7)
            end_date = now
        
        return start_date, end_date
    except Exception:
        # Fallback to weekly if any error
        now = datetime.utcnow()
        return now - timedelta(days=7), now

def safe_float(value, default=0.0):
    """Safely convert value to float"""
    try:
        if value is None:
            return default
        return float(value)
    except (ValueError, TypeError):
        return default

def safe_int(value, default=0):
    """Safely convert value to int"""
    try:
        if value is None:
            return default
        return int(value)
    except (ValueError, TypeError):
        return default

def validate_request_params(request):
    """Validate and sanitize request parameters"""
    try:
        period = request.args.get('period', 'weekly')
        if period not in ['daily', 'weekly', 'monthly', 'custom']:
            period = 'weekly'
        
        currency = request.args.get('currency', 'USD')
        if not currency or len(currency) != 3:
            currency = 'USD'
        
        timezone = request.args.get('timezone', 'UTC')
        if not timezone:
            timezone = 'UTC'
        
        return period, currency, timezone
    except Exception:
        return 'weekly', 'USD', 'UTC'

def execute_query_safely(query_func, default_result=None):
    """Execute database query with error handling"""
    try:
        result = query_func()
        return result if result is not None else default_result
    except Exception as e:
        print(f"Database query error: {e}")
        return default_result
    
def convert_currency(amount, from_currency='USD', to_currency='USD'):
    """Convert currency using exchange rate API with caching"""
    global exchange_rate_cache, cache_timestamp
    
    if from_currency == to_currency:
        return amount
    
    # Check cache validity (1 hour)
    if cache_timestamp and datetime.utcnow() - cache_timestamp < timedelta(hours=1):
        if f"{from_currency}_{to_currency}" in exchange_rate_cache:
            return amount * exchange_rate_cache[f"{from_currency}_{to_currency}"]
    
    try:
        # Fetch new rates
        response = requests.get(f'https://api.exchangerate-api.com/v4/latest/{from_currency}', timeout=5)
        rates = response.json()['rates']
        
        # Update cache
        for currency, rate in rates.items():
            exchange_rate_cache[f"{from_currency}_{currency}"] = rate
        cache_timestamp = datetime.utcnow()
        
        return amount * rates.get(to_currency, 1)
    except:
        return amount  # Return original amount if conversion fails

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = GeneralUser.query.get(current_user_id)
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

# Global error handler
@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(422)
def unprocessable_entity(error):
    return jsonify({'error': 'Invalid request data'}), 400

# Authentication endpoints
@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json() or {}
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = GeneralUser.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin access only'}), 403
        
        # Check password - handle both bcrypt and test password
        password_valid = False
        if user.password == 'testpassword' and password == 'testpassword':
            password_valid = True
        elif user.password and user.password.startswith('$2a$'):
            try:
                password_valid = bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8'))
            except:
                password_valid = False
        
        if not password_valid:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'name': f"{user.first_name or ''} {user.last_name or ''}".strip() or 'Admin',
                'email': user.email
            }
        })
        
    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500

# Missing metrics endpoints - adding the remaining ones
@app.route('/api/metrics/profit-margin', methods=['GET'])
@admin_required
def get_profit_margin_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        # Get profit margin data
        data = execute_query_safely(lambda: db.session.query(
            db.func.coalesce(db.func.sum(Order.profit), 0).label('total_profit'),
            db.func.coalesce(db.func.sum(Order.charge), 0).label('total_revenue')
        ).filter(
            Order.created >= start_date,
            Order.created <= end_date,
            Order.status == 'completed'
        ).first())
        
        if not data:
            data = type('obj', (object,), {'total_profit': 0, 'total_revenue': 0})
        
        total_profit = safe_float(data.total_profit)
        total_revenue = safe_float(data.total_revenue)
        margin = (total_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        return jsonify({
            'margin': margin
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch profit margin data'}), 500

# Metrics endpoints
@app.route('/api/metrics/deposits', methods=['GET'])
@admin_required
def get_deposits_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        # Get deposits (non-bonus transactions)
        deposits = execute_query_safely(lambda: db.session.query(
            db.func.coalesce(db.func.sum(GeneralTransactionLog.amount), 0).label('total'),
            db.func.count(GeneralTransactionLog.id).label('count')
        ).filter(
            GeneralTransactionLog.created >= start_date,
            GeneralTransactionLog.created <= end_date,
            GeneralTransactionLog.type != 'bonus',
            GeneralTransactionLog.status == 1
        ).first())
        
        if not deposits:
            deposits = type('obj', (object,), {'total': 0, 'count': 0})
        
        total = safe_float(deposits.total)
        total_converted = convert_currency(total, 'USD', currency)
        
        # Get previous period for comparison
        prev_start = start_date - (end_date - start_date)
        prev_deposits = execute_query_safely(lambda: db.session.query(
            db.func.coalesce(db.func.sum(GeneralTransactionLog.amount), 0).label('total')
        ).filter(
            GeneralTransactionLog.created >= prev_start,
            GeneralTransactionLog.created < start_date,
            GeneralTransactionLog.type != 'bonus',
            GeneralTransactionLog.status == 1
        ).first())
        
        prev_total = safe_float(prev_deposits.total if prev_deposits else 0)
        change = ((total - prev_total) / prev_total * 100) if prev_total > 0 else 0
        
        return jsonify({
            'total': total_converted,
            'count': safe_int(deposits.count),
            'change': change,
            'chartData': {
                'labels': ['Previous Period', 'Current Period'],
                'datasets': [{
                    'label': 'Deposits',
                    'data': [convert_currency(prev_total, 'USD', currency), total_converted],
                    'backgroundColor': ['rgba(59, 130, 246, 0.5)', 'rgba(59, 130, 246, 0.8)'],
                    'borderColor': ['rgb(59, 130, 246)', 'rgb(59, 130, 246)'],
                    'borderWidth': 2
                }]
            }
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch deposits data'}), 500

@app.route('/api/metrics/sales', methods=['GET'])
@admin_required
def get_sales_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        # Get completed orders
        sales = execute_query_safely(lambda: db.session.query(
            db.func.coalesce(db.func.sum(Order.charge), 0).label('total'),
            db.func.count(Order.id).label('count')
        ).filter(
            Order.created >= start_date,
            Order.created <= end_date,
            Order.status == 'completed'
        ).first())
        
        if not sales:
            sales = type('obj', (object,), {'total': 0, 'count': 0})
        
        total = safe_float(sales.total)
        total_converted = convert_currency(total, 'USD', currency)
        
        # Get previous period for comparison
        prev_start = start_date - (end_date - start_date)
        prev_sales = execute_query_safely(lambda: db.session.query(
            db.func.coalesce(db.func.sum(Order.charge), 0).label('total')
        ).filter(
            Order.created >= prev_start,
            Order.created < start_date,
            Order.status == 'completed'
        ).first())
        
        prev_total = safe_float(prev_sales.total if prev_sales else 0)
        change = ((total - prev_total) / prev_total * 100) if prev_total > 0 else 0
        
        return jsonify({
            'total': total_converted,
            'count': safe_int(sales.count),
            'change': change
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch sales data'}), 500

@app.route('/api/metrics/signups', methods=['GET'])
@admin_required
def get_signups_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        signups = execute_query_safely(lambda: db.session.query(
            db.func.count(GeneralUser.id).label('total')
        ).filter(
            GeneralUser.created >= start_date,
            GeneralUser.created <= end_date
        ).first())
        
        # Get previous period for comparison
        prev_start = start_date - (end_date - start_date)
        prev_signups = execute_query_safely(lambda: db.session.query(
            db.func.count(GeneralUser.id).label('total')
        ).filter(
            GeneralUser.created >= prev_start,
            GeneralUser.created < start_date
        ).first())
        
        total = safe_int(signups.total if signups else 0)
        prev_total = safe_int(prev_signups.total if prev_signups else 0)
        change = ((total - prev_total) / prev_total * 100) if prev_total > 0 else 0
        
        return jsonify({
            'total': total,
            'change': change
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch signups data'}), 500

@app.route('/api/metrics/signup-to-deposit', methods=['GET'])
@admin_required
def get_signup_to_deposit_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        # Users who signed up in period
        signups = execute_query_safely(lambda: db.session.query(
            db.func.count(GeneralUser.id)
        ).filter(
            GeneralUser.created >= start_date,
            GeneralUser.created <= end_date
        ).scalar(), 0)
        
        # Users who signed up and made deposits
        depositors = execute_query_safely(lambda: db.session.query(
            db.func.count(db.distinct(GeneralTransactionLog.uid))
        ).join(
            GeneralUser, GeneralTransactionLog.uid == GeneralUser.id
        ).filter(
            GeneralUser.created >= start_date,
            GeneralUser.created <= end_date,
            GeneralTransactionLog.type != 'bonus',
            GeneralTransactionLog.status == 1
        ).scalar(), 0)
        
        signups = safe_int(signups)
        depositors = safe_int(depositors)
        conversion_rate = (depositors / signups * 100) if signups > 0 else 0
        
        return jsonify({
            'signups': signups,
            'depositors': depositors,
            'conversion_rate': conversion_rate
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch signup-to-deposit data'}), 500

@app.route('/api/metrics/signup-to-order', methods=['GET'])
@admin_required
def get_signup_to_order_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        # Users who signed up in period
        signups = execute_query_safely(lambda: db.session.query(
            db.func.count(GeneralUser.id)
        ).filter(
            GeneralUser.created >= start_date,
            GeneralUser.created <= end_date
        ).scalar(), 0)
        
        # Users who signed up and placed orders
        orderers = execute_query_safely(lambda: db.session.query(
            db.func.count(db.distinct(db.cast(Order.uid, db.Integer)))
        ).join(
            GeneralUser, db.cast(Order.uid, db.Integer) == GeneralUser.id
        ).filter(
            GeneralUser.created >= start_date,
            GeneralUser.created <= end_date
        ).scalar(), 0)
        
        signups = safe_int(signups)
        orderers = safe_int(orderers)
        conversion_rate = (orderers / signups * 100) if signups > 0 else 0
        
        return jsonify({
            'signups': signups,
            'orderers': orderers,
            'conversion_rate': conversion_rate
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch signup-to-order data'}), 500

@app.route('/api/metrics/revenue', methods=['GET'])
@admin_required
def get_revenue_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        # Revenue from completed orders
        revenue = execute_query_safely(lambda: db.session.query(
            db.func.coalesce(db.func.sum(Order.charge), 0).label('total')
        ).filter(
            Order.created >= start_date,
            Order.created <= end_date,
            Order.status == 'completed'
        ).first())
        
        total = safe_float(revenue.total if revenue else 0)
        total_converted = convert_currency(total, 'USD', currency)
        
        # Get previous period for comparison
        prev_start = start_date - (end_date - start_date)
        prev_revenue = execute_query_safely(lambda: db.session.query(
            db.func.coalesce(db.func.sum(Order.charge), 0).label('total')
        ).filter(
            Order.created >= prev_start,
            Order.created < start_date,
            Order.status == 'completed'
        ).first())
        
        prev_total = safe_float(prev_revenue.total if prev_revenue else 0)
        change = ((total - prev_total) / prev_total * 100) if prev_total > 0 else 0
        
        # Generate chart data for trend
        chart_data = {
            'labels': [],
            'datasets': [{
                'label': 'Revenue',
                'data': [],
                'backgroundColor': 'rgba(34, 197, 94, 0.2)',
                'borderColor': 'rgb(34, 197, 94)',
                'borderWidth': 2,
                'fill': True
            }]
        }
        
        # Generate daily data for the period
        current_date = start_date
        while current_date <= end_date:
            next_date = current_date + timedelta(days=1)
            daily_revenue = execute_query_safely(lambda: db.session.query(
                db.func.coalesce(db.func.sum(Order.charge), 0).label('total')
            ).filter(
                Order.created >= current_date,
                Order.created < next_date,
                Order.status == 'completed'
            ).first())
            
            chart_data['labels'].append(current_date.strftime('%m/%d'))
            chart_data['datasets'][0]['data'].append(
                convert_currency(safe_float(daily_revenue.total if daily_revenue else 0), 'USD', currency)
            )
            current_date = next_date
        
        return jsonify({
            'total': total_converted,
            'change': change,
            'chartData': chart_data
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch revenue data'}), 500

@app.route('/api/metrics/profit', methods=['GET'])
@admin_required
def get_profit_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        # Profit from completed orders
        profit_data = execute_query_safely(lambda: db.session.query(
            db.func.coalesce(db.func.sum(Order.profit), 0).label('total_profit'),
            db.func.coalesce(db.func.sum(Order.charge), 0).label('total_revenue')
        ).filter(
            Order.created >= start_date,
            Order.created <= end_date,
            Order.status == 'completed'
        ).first())
        
        if not profit_data:
            profit_data = type('obj', (object,), {'total_profit': 0, 'total_revenue': 0})
        
        total_profit = safe_float(profit_data.total_profit)
        total_revenue = safe_float(profit_data.total_revenue)
        profit_converted = convert_currency(total_profit, 'USD', currency)
        
        # Calculate profit margin
        margin = (total_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        # Get previous period for comparison
        prev_start = start_date - (end_date - start_date)
        prev_profit_data = execute_query_safely(lambda: db.session.query(
            db.func.coalesce(db.func.sum(Order.profit), 0).label('total_profit'),
            db.func.coalesce(db.func.sum(Order.charge), 0).label('total_revenue')
        ).filter(
            Order.created >= prev_start,
            Order.created < start_date,
            Order.status == 'completed'
        ).first())
        
        if not prev_profit_data:
            prev_profit_data = type('obj', (object,), {'total_profit': 0, 'total_revenue': 0})
        
        prev_profit = safe_float(prev_profit_data.total_profit)
        prev_revenue = safe_float(prev_profit_data.total_revenue)
        prev_margin = (prev_profit / prev_revenue * 100) if prev_revenue > 0 else 0
        
        change = ((total_profit - prev_profit) / prev_profit * 100) if prev_profit > 0 else 0
        margin_change = margin - prev_margin
        
        return jsonify({
            'total': profit_converted,
            'change': change,
            'margin': margin,
            'marginChange': margin_change
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch profit data'}), 500

@app.route('/api/metrics/orders/count', methods=['GET'])
@admin_required
def get_orders_count_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        orders = execute_query_safely(lambda: db.session.query(
            db.func.count(Order.id).label('total')
        ).filter(
            Order.created >= start_date,
            Order.created <= end_date
        ).first())
        
        # Get previous period for comparison
        prev_start = start_date - (end_date - start_date)
        prev_orders = execute_query_safely(lambda: db.session.query(
            db.func.count(Order.id).label('total')
        ).filter(
            Order.created >= prev_start,
            Order.created < start_date
        ).first())
        
        total = safe_int(orders.total if orders else 0)
        prev_total = safe_int(prev_orders.total if prev_orders else 0)
        change = ((total - prev_total) / prev_total * 100) if prev_total > 0 else 0
        
        return jsonify({
            'total': total,
            'change': change
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch orders count data'}), 500

@app.route('/api/metrics/orders/average-charge', methods=['GET'])
@admin_required
def get_orders_average_charge_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        avg_charge = execute_query_safely(lambda: db.session.query(
            db.func.coalesce(db.func.avg(Order.charge), 0).label('average')
        ).filter(
            Order.created >= start_date,
            Order.created <= end_date,
            Order.status == 'completed'
        ).first())
        
        average = safe_float(avg_charge.average if avg_charge else 0)
        average_converted = convert_currency(average, 'USD', currency)
        
        return jsonify({
            'average': average_converted
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch average charge data'}), 500

@app.route('/api/metrics/users/zero-balance', methods=['GET'])
@admin_required
def get_users_zero_balance_metrics():
    try:
        count = execute_query_safely(lambda: db.session.query(
            db.func.count(GeneralUser.id).label('total')
        ).filter(
            GeneralUser.balance == 0,
            GeneralUser.status == 1
        ).first())
        
        return jsonify({
            'zeroBalance': safe_int(count.total if count else 0)
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch zero balance users data'}), 500

@app.route('/api/metrics/users/affiliate-positive', methods=['GET'])
@admin_required
def get_users_affiliate_positive_metrics():
    try:
        count = execute_query_safely(lambda: db.session.query(
            db.func.count(GeneralUser.id).label('total')
        ).filter(
            GeneralUser.affiliate_bal_available > 0,
            GeneralUser.status == 1
        ).first())
        
        return jsonify({
            'affiliatePositive': safe_int(count.total if count else 0)
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch affiliate positive users data'}), 500

@app.route('/api/metrics/users/inactive', methods=['GET'])
@admin_required
def get_users_inactive_metrics():
    try:
        # Users with no activity in last 30 days
        cutoff_date = datetime.utcnow() - timedelta(days=30)
        
        inactive_count = execute_query_safely(lambda: db.session.query(
            db.func.count(GeneralUser.id).label('total')
        ).filter(
            db.or_(
                GeneralUser.changed < cutoff_date,
                GeneralUser.changed.is_(None)
            ),
            GeneralUser.status == 1
        ).first())
        
        return jsonify({
            'inactive': safe_int(inactive_count.total if inactive_count else 0)
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch inactive users data'}), 500

@app.route('/api/metrics/average-deposit', methods=['GET'])
@admin_required
def get_average_deposit_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        avg_deposit = execute_query_safely(lambda: db.session.query(
            db.func.coalesce(db.func.avg(GeneralTransactionLog.amount), 0).label('average')
        ).filter(
            GeneralTransactionLog.created >= start_date,
            GeneralTransactionLog.created <= end_date,
            GeneralTransactionLog.type != 'bonus',
            GeneralTransactionLog.status == 1
        ).first())
        
        average = safe_float(avg_deposit.average if avg_deposit else 0)
        average_converted = convert_currency(average, 'USD', currency)
        
        return jsonify({
            'average': average_converted
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch average deposit data'}), 500

@app.route('/api/metrics/top-customers', methods=['GET'])
@admin_required
def get_top_customers_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        # Get top customers by total spent
        top_customers = execute_query_safely(lambda: db.session.query(
            GeneralUser.first_name,
            GeneralUser.last_name,
            db.func.coalesce(db.func.sum(Order.charge), 0).label('total_spent'),
            db.func.count(Order.id).label('order_count')
        ).join(
            Order, db.cast(Order.uid, db.Integer) == GeneralUser.id
        ).filter(
            Order.created >= start_date,
            Order.created <= end_date,
            Order.status == 'completed'
        ).group_by(
            GeneralUser.id, GeneralUser.first_name, GeneralUser.last_name
        ).order_by(
            db.func.sum(Order.charge).desc()
        ).limit(10).all(), [])
        
        labels = []
        data = []
        
        for customer in top_customers:
            name = f"{customer.first_name or ''} {customer.last_name or ''}".strip() or 'Unknown'
            labels.append(name[:20] + '...' if len(name) > 20 else name)
            data.append(convert_currency(safe_float(customer.total_spent), 'USD', currency))
        
        chart_data = {
            'labels': labels,
            'datasets': [{
                'label': 'Total Spent',
                'data': data,
                'backgroundColor': 'rgba(147, 51, 234, 0.8)',
                'borderColor': 'rgb(147, 51, 234)',
                'borderWidth': 1
            }]
        }
        
        return jsonify(chart_data)
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch top customers data'}), 500

@app.route('/api/metrics/best-selling', methods=['GET'])
@admin_required
def get_best_selling_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        # Get best selling services
        best_selling = execute_query_safely(lambda: db.session.query(
            Order.service_id,
            db.func.count(Order.id).label('order_count'),
            db.func.coalesce(db.func.sum(Order.charge), 0).label('total_revenue')
        ).filter(
            Order.created >= start_date,
            Order.created <= end_date,
            Order.status == 'completed'
        ).group_by(
            Order.service_id
        ).order_by(
            db.func.count(Order.id).desc()
        ).limit(10).all(), [])
        
        labels = []
        data = []
        
        for service in best_selling:
            labels.append(f"Service {service.service_id or 'Unknown'}")
            data.append(safe_int(service.order_count))
        
        chart_data = {
            'labels': labels,
            'datasets': [{
                'label': 'Orders',
                'data': data,
                'backgroundColor': 'rgba(34, 197, 94, 0.8)',
                'borderColor': 'rgb(34, 197, 94)',
                'borderWidth': 1
            }]
        }
        
        return jsonify(chart_data)
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch best selling data'}), 500

@app.route('/api/metrics/rewards', methods=['GET'])
@admin_required
def get_rewards_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        # Get bonus/reward transactions
        rewards = execute_query_safely(lambda: db.session.query(
            db.func.coalesce(db.func.sum(GeneralTransactionLog.amount), 0).label('total'),
            db.func.count(GeneralTransactionLog.id).label('count')
        ).filter(
            GeneralTransactionLog.created >= start_date,
            GeneralTransactionLog.created <= end_date,
            GeneralTransactionLog.type == 'bonus',
            GeneralTransactionLog.status == 1
        ).first())
        
        if not rewards:
            rewards = type('obj', (object,), {'total': 0, 'count': 0})
        
        total = safe_float(rewards.total)
        total_converted = convert_currency(total, 'USD', currency)
        
        return jsonify({
            'total': total_converted,
            'count': safe_int(rewards.count)
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch rewards data'}), 500

@app.route('/api/metrics/ltv', methods=['GET'])
@admin_required
def get_ltv_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        # Calculate average lifetime value
        # First get user totals, then average them
        user_totals = execute_query_safely(lambda: db.session.query(
            db.func.coalesce(db.func.sum(Order.charge), 0).label('user_total')
        ).join(
            GeneralUser, db.cast(Order.uid, db.Integer) == GeneralUser.id
        ).filter(
            GeneralUser.created >= start_date,
            GeneralUser.created <= end_date,
            Order.status == 'completed'
        ).group_by(
            GeneralUser.id
        ).all(), [])
        
        if user_totals:
            total_ltv = sum(safe_float(user.user_total) for user in user_totals)
            ltv = total_ltv / len(user_totals)
        else:
            ltv = 0
        
        ltv_converted = convert_currency(ltv, 'USD', currency)
        
        return jsonify({
            'ltv': ltv_converted
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch LTV data'}), 500

@app.route('/api/metrics/deposit-methods', methods=['GET'])
@admin_required
def get_deposit_methods_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        methods = execute_query_safely(lambda: db.session.query(
            GeneralTransactionLog.type,
            db.func.coalesce(db.func.sum(GeneralTransactionLog.amount), 0).label('total'),
            db.func.count(GeneralTransactionLog.id).label('count')
        ).filter(
            GeneralTransactionLog.created >= start_date,
            GeneralTransactionLog.created <= end_date,
            GeneralTransactionLog.type != 'bonus',
            GeneralTransactionLog.status == 1
        ).group_by(
            GeneralTransactionLog.type
        ).all(), [])
        
        labels = []
        data = []
        colors = [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)'
        ]
        
        for i, method in enumerate(methods):
            labels.append((method.type or 'Unknown').title())
            data.append(convert_currency(safe_float(method.total), 'USD', currency))
        
        chart_data = {
            'labels': labels,
            'datasets': [{
                'data': data,
                'backgroundColor': colors[:len(data)],
                'borderWidth': 2,
                'borderColor': '#fff'
            }]
        }
        
        return jsonify(chart_data)
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch deposit methods data'}), 500

@app.route('/api/metrics/orders/status-distribution', methods=['GET'])
@admin_required
def get_orders_status_distribution_metrics():
    try:
        period, currency, timezone = validate_request_params(request)
        
        start_date, end_date = get_date_range(period, timezone)
        
        statuses = execute_query_safely(lambda: db.session.query(
            Order.status,
            db.func.count(Order.id).label('count')
        ).filter(
            Order.created >= start_date,
            Order.created <= end_date
        ).group_by(
            Order.status
        ).all(), [])
        
        labels = []
        data = []
        colors = [
            'rgba(34, 197, 94, 0.8)',   # completed - green
            'rgba(59, 130, 246, 0.8)',  # pending - blue
            'rgba(245, 158, 11, 0.8)',  # processing - yellow
            'rgba(239, 68, 68, 0.8)',   # canceled - red
            'rgba(139, 92, 246, 0.8)',  # other - purple
        ]
        
        for i, status in enumerate(statuses):
            labels.append((status.status or 'Unknown').title())
            data.append(safe_int(status.count))
        
        chart_data = {
            'labels': labels,
            'datasets': [{
                'data': data,
                'backgroundColor': colors[:len(data)],
                'borderWidth': 2,
                'borderColor': '#fff'
            }]
        }
        
        return jsonify(chart_data)
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch order status distribution data'}), 500

# User search and details
@app.route('/api/users/search', methods=['GET'])
@admin_required
def search_users_endpoint():
    try:
        query = request.args.get('query', '').strip()
        
        if len(query) < 2:
            return jsonify([])
        
        users = execute_query_safely(lambda: GeneralUser.query.filter(
            db.or_(
                GeneralUser.first_name.like(f'%{query}%'),
                GeneralUser.last_name.like(f'%{query}%'),
                GeneralUser.email.like(f'%{query}%')
            )
        ).limit(10).all(), [])
        
        results = []
        for user in users:
            results.append({
                'id': user.id,
                'first_name': user.first_name or '',
                'last_name': user.last_name or '',
                'email': user.email or '',
                'balance': safe_float(user.balance),
                'role': user.role or 'user'
            })
        
        return jsonify(results)
        
    except Exception as e:
        return jsonify({'error': 'Failed to search users'}), 500

@app.route('/api/user/<int:user_id>/history', methods=['GET'])
@admin_required
def get_user_history_endpoint(user_id):
    try:
        user = GeneralUser.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's orders
        orders = execute_query_safely(lambda: Order.query.filter(
            db.cast(Order.uid, db.Integer) == user_id
        ).order_by(Order.created.desc()).limit(10).all(), [])
        
        # Get user's transactions
        transactions = execute_query_safely(lambda: GeneralTransactionLog.query.filter_by(
            uid=user_id
        ).order_by(GeneralTransactionLog.created.desc()).limit(10).all(), [])
        
        # Get top services
        top_services = execute_query_safely(lambda: db.session.query(
            Order.service_id,
            db.func.count(Order.id).label('count'),
            db.func.coalesce(db.func.sum(Order.charge), 0).label('total_spent')
        ).filter(
            db.cast(Order.uid, db.Integer) == user_id,
            Order.status == 'completed'
        ).group_by(
            Order.service_id
        ).order_by(
            db.func.sum(Order.charge).desc()
        ).limit(5).all(), [])
        
        # Calculate stats
        total_spent = execute_query_safely(lambda: db.session.query(
            db.func.coalesce(db.func.sum(Order.charge), 0).label('total')
        ).filter(
            db.cast(Order.uid, db.Integer) == user_id,
            Order.status == 'completed'
        ).first())
        
        total_orders = execute_query_safely(lambda: db.session.query(
            db.func.count(Order.id).label('total')
        ).filter(
            db.cast(Order.uid, db.Integer) == user_id
        ).first())
        
        result = {
            'profile': {
                'id': user.id,
                'first_name': user.first_name or '',
                'last_name': user.last_name or '',
                'email': user.email or '',
                'role': user.role or 'user',
                'balance': safe_float(user.balance),
                'affiliate_bal_available': safe_float(user.affiliate_bal_available),
                'created': user.created.isoformat() if user.created else None
            },
            'stats': {
                'totalSpent': safe_float(total_spent.total if total_spent else 0),
                'totalOrders': safe_int(total_orders.total if total_orders else 0)
            },
            'recentOrders': [{
                'id': order.id,
                'service_id': order.service_id or '',
                'charge': safe_float(order.charge),
                'status': order.status or 'unknown',
                'created': order.created.isoformat() if order.created else None
            } for order in orders],
            'recentTransactions': [{
                'id': transaction.id,
                'type': transaction.type or 'unknown',
                'amount': safe_float(transaction.amount),
                'transaction_id': transaction.transaction_id or '',
                'created': transaction.created.isoformat() if transaction.created else None
            } for transaction in transactions],
            'topServices': [{
                'service_id': service.service_id or 'unknown',
                'count': safe_int(service.count),
                'total_spent': safe_float(service.total_spent)
            } for service in top_services]
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch user history'}), 500

# System notifications
@app.route('/api/system/notifications', methods=['GET'])
@admin_required
def get_system_notifications():
    try:
        # Mock notifications - in real app, these would come from database
        notifications = [
            {
                'message': 'New user registration spike detected',
                'time': '2 minutes ago',
                'type': 'info'
            },
            {
                'message': 'High value transaction completed',
                'time': '15 minutes ago',
                'type': 'success'
            },
            {
                'message': 'System maintenance scheduled for tonight',
                'time': '1 hour ago',
                'type': 'warning'
            }
        ]
        
        return jsonify(notifications)
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch notifications'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=8004, debug=True)