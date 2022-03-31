#!/usr/bin/env python
#https://websockets.readthedocs.io/en/stable/
import asyncio
import datetime
import random
import websockets

async def time(websocket, path):
    while True:
        # sends whatever you want
        await websocket.send("server message python")
        await asyncio.sleep(random.random() * 3) # so that it doesn't run too fast and crash

# this is the server
start_server = websockets.serve(time, '127.0.0.1', 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
