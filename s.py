import asyncio
import json
import websockets

USERS = []

# returns how many users are logged in
def users_event():
    return json.dumps({"type": "users", "count": len(USERS)})

# parse data from clients about where to draw rects and circles
def value_event(message):
    return message

async def send_data(websocket):
    try:
        # Register user
        USERS.append(websocket)
        print("New user entered!")
        # Tell all the clients about the new user.
        websockets.broadcast(USERS, users_event())

        # Tell clients about somebody clicking on canvas.
        async for message in websocket:
            websockets.broadcast(USERS, value_event(message))

    finally:
        # Unregister user
        USERS.remove(websocket)
        print("Some user exited.")
        websockets.broadcast(USERS, users_event())


async def main():
    # server at localhost 6789
    async with websockets.serve(send_data, "localhost", 6789):
        await asyncio.Future() # run forever


if __name__ == "__main__":
    asyncio.run(main())
