import http.server
import socketserver
import urllib.parse
import requests

PORT = 8000
CLIENT_ID = "a77aaa7467210bc89727"
CLIENT_SECRET = "7c8fdfe14df9b4c510d08993cfcccb3b2a527348"
REDIRECT_URI = "http://localhost:8000/budget.html"

class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/callback"):
            # Handle the GitHub OAuth callback
            query = urllib.parse.urlparse(self.path).query
            params = urllib.parse.parse_qs(query)

            # Retrieve the authorization code from the callback URL
            if "code" in params:
                code = params["code"][0]

                # Exchange the authorization code for an access token
                data = {
                    "client_id": CLIENT_ID,
                    "client_secret": CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": REDIRECT_URI,
                }
                headers = {"Accept": "application/json"}
                response = requests.post("https://github.com/login/oauth/access_token", data=data, headers=headers)
                if response.status_code == 200:
                    response_data = response.json()
                    if "access_token" in response_data:
                        access_token = response_data["access_token"]

                        # Use the access token to fetch user details
                        headers = {"Authorization": f"token {access_token}"}
                        user_response = requests.get("https://api.github.com/user", headers=headers)
                        if user_response.status_code == 200:
                            user_data = user_response.json()
                            username = user_data["login"]
                            # You can perform further validation or checks here if required

                            # Redirect the user to the budget.html page
                            self.send_response(302)
                            self.send_header("Location", "http://localhost:8000/budget.html")
                            self.end_headers()
                            return
                        else:
                            print("Failed to fetch user details from GitHub")
                    else:
                        print("Access token not found in response")
                else:
                    print("Failed to exchange authorization code for access token")

            # Redirect the user to an error page if authentication fails
            self.send_response(302)
            self.send_header("Location", "http://localhost:8000/error.html")
            self.end_headers()
        else:
            # Serve static files as usual
            super().do_GET()

with socketserver.TCPServer(("", PORT), MyRequestHandler) as httpd:
    print("Server running at http://localhost:{}/".format(PORT))
    httpd.serve_forever()
