"""
WSGI entry point for PythonAnywhere.
In the PythonAnywhere web app config, set the WSGI file to:
    /home/<your-username>/SmartCity/backend/wsgi.py
"""
from app import app as application
