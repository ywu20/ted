import json
from flask import *
from flask_socketio import *

USERS = []
app = Flask(__name__)
app.config['SECRET_KEY'] = 'some super secret key!'
socketio = SocketIO(app, logger=True)

@app.route("/")
def boo():
    return render_template('hello.html')

@socketio.event
def my_ping():
    emit('my_pong')

@socketio.on('send_mouse')
def message_recieved(data):
    # print(data['text'])
    emit('draw_to_all', data, broadcast=True)
    # emit('message_from_server', {'text':'Message recieved!'})


if __name__ == "__main__":
    socketio.run(app, port=8000, debug=True)
