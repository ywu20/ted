from flask import Flask, render_template
app = Flask(__name__) # Q0: Where have you seen similar syntax in other langs?

@app.route("/")
def boo():
    print("main")
    return render_template('hello.html')
app.run()
