
  # Budget Dashboard for Calcura

  This is a code bundle for Budget Dashboard for Calcura.

  ## Quick Start

  Run `bash setup.sh` to install all dependencies and start the application. This handles the frontend, backend, and virtual environment setup for you.

  To shut it down press `Ctrl+C` in the terminal. This stops both the frontend and backend.

  ## Running the code manually

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Running the back-end database

  You need Python 3 and pip installed.

  Set up a virtual environment and install dependencies:

  ```
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
  ```

To run the app, use the command: `uvicorn main:app --reload`

If this command does not work, use `python -m uvicorn main:app --reload` instead

If nothing wors try `cd project-calcura-capstone` and then run the command again

`http://127.0.0.1:8000/docs#/` to access the API documentation and test the endpoints.

  ## Troubleshooting

  **Permission denied when running `npm run dev`**

  The vite binary might not have execute permissions. Run `chmod +x node_modules/.bin/*` and try again. The setup script handles this automatically.

  **`.venv` or `node_modules` owned by root**

  This happens if you ran the setup script or npm with `sudo`. Do not use sudo with npm commands. Fix it with:
  ```
  sudo chown -R $(whoami):$(whoami) .venv node_modules
  ```
  Or delete the `.venv` folder and run `bash setup.sh` again.

  **Backend wont start or module not found**

  Make sure you activated the virtual environment first with `source .venv/bin/activate` and installed the dependencies with `pip install -r requirements.txt`.

  **Port already in use**

  If the backend or frontend says the port is already in use, something is still running from last time. Find it with `lsof -i :8000` or `lsof -i :5173` and kill the process, or just restart your terminal.

