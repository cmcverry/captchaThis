from bs4 import BeautifulSoup
import json
import requests
import socket
import time


search_url = "https://api.bing.microsoft.com/v7.0/images/search"
headers = {"Ocp-Apim-Subscription-Key" : '0742017a979144f0bdc5a2f4af511cae' }


def runImageScraper():
    host = "127.0.0.1"
    port = 7440

    # creates the socket 
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # binds host and port
    s.bind((host, port))

    # server listens with a buffer of 6
    s.listen(12)

    while True:
        # accepts and establishes a new connection
        clientsock, address = s.accept()
        print("connection established with: " + str(address))

        # decode the client request and save the query input
        request = clientsock.recv(1024).decode("utf-8")
        jsonrequest = json.loads(request)
        query = jsonrequest["query"]

        search_term = query
        params = {"q": search_term, "imageType": "photo", "count": "15"}

        response = requests.get(search_url, headers=headers, params=params)
        response.raise_for_status()
        search_results = response.json()

        arr_results = []

        # Return only 15 results
        # i = 0
        for image in search_results["value"]:
            # if i >= 15:
            #     break
            url = (image["contentUrl"])
            arr_results.append(url)
            # i += 1
            
        # convert the dictionary object to a json object and send to client
        response = json.dumps(arr_results)
        clientsock.send(response.encode("utf-8"))
        clientsock.close()

if __name__ == '__main__':
    runImageScraper()
       




