#!/usr/bin/env python


import asyncio

import json

import logging

import websockets


logging.basicConfig()


USERS = set()


XCOR = 0
YCOR = 0

def users_event():

    return json.dumps({"type": "users", "count": len(USERS)})


def value_event(message):
    message = message.split(" ")
    print(message)
    coor = message[1]
    coor = coor.split(",")
    print(message)
    print(coor)
    return json.dumps({"mode":message[0] , "xcor": coor[0], "ycor" : coor[1]})


async def counter(websocket):

    global USERS, VALUE

    try:

        # Register user

        USERS.add(websocket)

        #websockets.broadcast(USERS, users_event())

        # Send current state to user

        # await websocket.send(value_event())

        # Manage state changes

        async for message in websocket:
            websockets.broadcast(USERS, value_event(message))

    finally:

        # Unregister user

        USERS.remove(websocket)

        websockets.broadcast(USERS, users_event())


async def main():

    async with websockets.serve(counter, "localhost", 6789):

        await asyncio.Future()  # run forever


if __name__ == "__main__":

    asyncio.run(main())
