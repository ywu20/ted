from flask import *
from flask_socketio import *

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# site routes
@app.route("/")
def boo():
    return render_template('hello.html')

# socketio events
# @socketio.on('my event')
# def test_message(message):
#     emit('my response', {'data': message['data']})

@socketio.on('send_message')
def message_recieved(data):
    print(data['text'])

@socketio.on('connect')
def test_connect():
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    # socketio.run(app)
    app.run()
