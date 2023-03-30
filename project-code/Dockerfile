FROM node:18.12.0
WORKDIR /app
COPY ./backend/package.json ./backend/
COPY ./frontend/package.json ./frontend/
RUN cd backend && npm install
RUN cd frontend && npm install
COPY ./backend ./backend
COPY ./frontend ./frontend
EXPOSE 5000 3000
WORKDIR /app
CMD node backend/server.js & npm start --prefix frontend