import asyncio
import json
import logging
from websockets.legacy.server import WebSocketServerProtocol
import websockets.server as websockets
import orjson as json
from collections import defaultdict
from urllib import parse
import os


CLIENT_LOBBY = defaultdict(set)
LOBBIES = dict()

def register(websocket:WebSocketServerProtocol):
  _, data = parse.parse_qsl(parse.urlparse(websocket.path).query)[0]
  data = json.loads(data)
  
  ACTION_TYPE = data["ACTION_TYPE"]
  LOBBY_CODE = data["lobbyCode"]

  if(ACTION_TYPE=='viewer'):
    CLIENT_LOBBY[LOBBY_CODE].add(websocket)
  elif(ACTION_TYPE=='writter'):
    LOBBIES[websocket] = LOBBY_CODE
  

def unregister(websocket:WebSocketServerProtocol):
 print("Client Disconnected")


async def start(websocket:WebSocketServerProtocol, path:str):
 register(websocket)

 try:
  async for message in websocket:
   try:
    LOBBY_CODE = LOBBIES[websocket]

    for client in CLIENT_LOBBY[LOBBY_CODE]:
      await client.send(message)
   except: print(f"Failed to parse message from client : {message}")
 except:
  print("Error Ocured")
 finally:
  unregister(websocket)


start_server = websockets.serve(start, "localhost", port=os.environ.get("PORT",8080))
print("Server Started...")
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()