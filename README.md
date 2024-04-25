# HomeLess

## Description
Homeless is a project aimed at enhancing the efficiency and convenience of managing household devices remotely. By connecting to the Adafruit server, this system enables users to monitor and control various appliances and utilities within their homes from anywhere with an internet connection.

## Installation
### Backend packages
> [!WARNING]
> Remember to create virtualenv using **py -m venv env** and enter the virtualenv **env\Scripts\activate** before installing requirement packages
```
    cd backend
    pip install -r requirements.txt
```
### Frontend packages
```
    cd homeless
    npm i
```
### Running development server
> [!WARNING]
> Remember to enter virtualenv using **env\Scripts\activate** before running backend development server
```
    cd backend
    python manage.py runserver
```
```
    cd homeless
    npm start
```