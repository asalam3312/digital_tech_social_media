import os # para saber la ruta absoluta de la db si no la encontramos
from flask_bcrypt import Bcrypt  # encriptar y comparar
from flask import Flask, request, jsonify, Blueprint # endpoints
from flask_sqlalchemy import SQLAlchemy  # rutas
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from sqlalchemy import Enum
from enum import Enum as PyEnum
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# ENCRIPTACION JWT y BCRYPT-------

app.config["JWT_SECRET_KEY"] = "valor-variable"  # clave secreta para firmar los tokens, cuanto mas largo mejor.
jwt = JWTManager(app)  # instanciamos jwt de JWTManager utilizando app para tener las herramientas de encriptacion.
bcrypt = Bcrypt(app)   # para encriptar password

# DATABASE---------------
db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'instance', 'mydatabase.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

print(f"Ruta de la base de datos: {db_path}")

class StatusEnum(PyEnum):
    drafted = "drafted"
    deleted = "deleted"
    published = "published"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    avatar = db.Column(db.String(900), nullable=True)
    username = db.Column(db.String(20), nullable=False)
    posts = db.relationship('Post', back_populates='author')
    liked_posts = db.relationship('Post', secondary='post_likes', back_populates='likes')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'surname': self.surname,
            'username': self.username,
            'email': self.email,
            'password': '',
            'avatar': self.avatar
        }

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(500), nullable=False)
    image = db.Column(db.String(900))
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    author = db.relationship('User', back_populates='posts')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    location = db.Column(db.String(30), nullable=False)
    status = db.Column(db.Enum(StatusEnum), nullable=False)
    likes = db.relationship('User', secondary='post_likes', back_populates='liked_posts')

    def to_dict(self):
        return {
            'id': self.id,
            'message': self.message,
            'image': self.image,
            'author_id': self.author_id,
            'created_at': self.created_at.isoformat(),
            'location': self.location,
            'status': self.status.value,  # Convertimos StatusEnum a su valor en cadena
            'likes': [like.id for like in self.likes]
        }

class PostLikes(db.Model):
    __tablename__ = 'post_likes'
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)

if not os.path.exists(os.path.dirname(db_path)): # Nos aseguramos que se cree carpeta instance automatico para poder tener mydatabase.db dentro.
    os.makedirs(os.path.dirname(db_path))

with app.app_context():
    db.create_all() # Nos aseguramos que este corriendo en el contexto del proyecto.
# -----------------------

# ROUTES-----------------

@app.route('/')
def hello():
    return '¡Hola, mundo!'

# ---------------------------RUTA DE REGISTRO---------------------------
@app.route('/users', methods=['POST'])
def create_user():
    try:
        name = request.json.get('name')
        surname = request.json.get('surname')
        username = request.json.get('username')
        email = request.json.get('email')
        password = request.json.get('password')

        if not email or not password or not name or not surname or not username:
            return jsonify({'error': 'Email, password, name, surname and username are required.'}), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email already exists.'}), 409

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(name=name,surname=surname,username=username, email=email, password=password_hash)

        try:
            db.session.add(new_user)
            db.session.commit()
            print("User added successfully")
        except Exception as commit_error:
            print("Error committing to the database:", commit_error)
            return jsonify({'error': 'Error committing to the database: ' + str(commit_error)}), 500

        return jsonify({'message': 'User created successfully.'}), 201

    except Exception as e:
        print("Error in user creation:", e)
        return jsonify({'error': 'Error in user creation: ' + str(e)}), 500

# ---------------------------RUTA GENERADORA DE TOKEN---------------------------
@app.route('/token', methods=['POST'])
def get_token():
    try:
        email = request.json.get('email')
        password = request.json.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required.'}), 400

        login_user = User.query.filter_by(email=request.json['email']).one()
        password_db = login_user.password
        true_o_false = bcrypt.check_password_hash(password_db, password)

        if true_o_false:
            # Lógica para crear y enviar el token
            user_id = login_user.id
            access_token = create_access_token(identity=user_id)
            return {'access_token': access_token}, 200

        else:
            return {"Error": "Contraseña incorrecta"}

    except Exception as e:
        return {"Error": "Email not found: " + str(e)}, 500

# ------------------------------RUTA RESTRINGIDA POR TOKEN-------------------------------
@app.route('/users')
@jwt_required()
def show_users():
    current_user_id = get_jwt_identity()  # Obtiene la identidad del usuario del token
    if current_user_id:
        users = User.query.all()
        user_list = []
        for user in users:
            user_dict = {
                'id': user.id,
                'email': user.email
            }
            user_list.append(user_dict)
        return jsonify(user_list)
    else:
        return {"Error": "Token inválido o no proporcionado"}, 401

# ------------------------------RUTA Información de los Usuarios-------------------------------
@app.route('/usersInfo', methods=['GET'])
def get_users():
    try:
        users = User.query.all()  # Obtener todos los usuarios de la base de datos
        users_list = [user.to_dict() for user in users]  # Convertir cada usuario a diccionario
        return jsonify(users_list), 200  # Devolver la lista de usuarios como JSON
    except Exception as e:
        return jsonify({'error': 'Error fetching users: ' + str(e)}), 500

# --------------------------------------Ruta Detalles del Usuario----------------------------------------------------------
@app.route('/user-details', methods=['GET'])
@jwt_required()
def get_user_details():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify(user.to_dict()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------------------RUTA POSTEO DE POSTS------------------------------
@app.route('/Post', methods=['POST'])
def new_post():
    try:
        message = request.json.get('message')
        image = request.json.get('image')
        author_id = request.json.get('author_id')   # debo hacer que los dos autores se obtengan de manera automatica
        author = request.json.get('author')
        created_at = request.json.get('created_at')
        location = request.json.get('location')
        status = request.json.get('status')

        if not message or not author_id or not author or not created_at or not location or not status:
            return jsonify({'error': 'Message, author_id, created_at, location, and status are required.'}), 400

        # Verificar si el author_id corresponde a un usuario existente
        authorNumber = User.query.get(author_id)
        if not authorNumber:
            return jsonify({'error': 'Author not found.'}), 404

        # Convertir el string `created_at` a datetime
        try:
            created_at = datetime.strptime(created_at, '%Y-%m-%dT%H:%M:%S')  # formato ISO 8601
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DDTHH:MM:SS.'}), 400

        # Verificar que el status esté en el enum
        try:
            status_enum = StatusEnum[status]
        except KeyError:
            return jsonify({'error': 'Invalid status value.'}), 400

        new_post = Post(
            message=message,
            image=image,
            author_id=author_id,
            created_at=created_at,
            location=location,
            status=status_enum  # Solo es posible pasarle uno de los valores dados en class StatusEnum(PyEnum)
        )

        db.session.add(new_post)
        db.session.commit()

        return jsonify({'message': 'Post created successfully.'}), 201

    except Exception as e:
        return jsonify({'error': 'Error creating post: ' + str(e)}), 500

# ------------------------------RUTA PARA OBTENER TODOS LOS POSTS------------------------------
api = Blueprint('api', __name__)

@api.route('/posts', methods=['GET'])
def get_posts():
    try:
        posts = Post.query.all()
        posts_list = []
        for post in posts:
            post_dict = {
                'id': post.id,
                'message': post.message,
                'image': post.image,
                'author_id': post.author_id,
                'author': post.author.username,  # Modificado a solo el nombre de usuario
                'created_at': post.created_at.isoformat(),
                'location': post.location,
                'status': post.status.value,
                'likes': [like.id for like in post.likes]
            }
            posts_list.append(post_dict)
        return jsonify(posts_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Registra el Blueprint en la aplicación
app.register_blueprint(api, url_prefix='/api')

#al final ( detecta que encendimos el servidor desde terminal y nos da detalles de los errores )
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
