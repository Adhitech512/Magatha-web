# https_server.py
import http.server, ssl

server_address = ('', 4443)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket,
                               certfile='cert.pem',
                               keyfile='key.pem',
                               server_side=True)

print("Serving on https://localhost:4443")
httpd.serve_forever()
