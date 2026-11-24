
# Express PostgreSQL API — Game Inventory Management

 A REST API built with Express.js and PostgreSQL for managing players, weapons, and inventory data.

 This project was built to practice and demonstrate backend development, relational database management,
 Docker containerization, Docker Compose, and Git/GitHub workflows.

## Features

 - Player management
 - PostgreSQL relational database
 - REST API with Express.js
 - JSON request and response handling
 - Centralized error handling
 - 404 route handling
 - Request logging
 - Environment-based configuration with `.env`
 - Docker containerization
 - Docker Compose for API and PostgreSQL
 - Persistent PostgreSQL storage
 - PostgreSQL database backup and restore

## Tech Stack

 - **Node.js** - JavaScript runtime
 - **Express.js** - REST API framework
 - **PostgreSQL** - Relational database
 - **Docker** - Application containerization
 - **Docker Compose** - Multi-container application management
 - **Git** - Version control
 - **GitHub** - Remote repository and source code hosting

## Architecture

The application uses Docker Compose to run the Express API and PostgreSQL database as separate services.

```text
                  Client
                    |
                    | HTTP Request
                    v
         +----------------------+
         |     Express API      |
         |      Port 8000       |
         +----------------------+
                    |
                    v
         +----------------------+
         |      Middleware      |
         +----------------------+
                    |
                    v
         +----------------------+
         |        Routes        |
         |      /players        |
         +----------------------+
                    |
                    v
         +----------------------+
         |     Controllers      |
         +----------------------+
                    |
                    | SQL Queries
                    v
         +----------------------+
         |    PostgreSQL 16     |
         |       game_db        |
         +----------------------+

 Docker Compose manages the API and database containers.
```
## Database Structure

 The application uses PostgreSQL with three main tables.

### Players

 Stores player information.

  | Column      | Description                     |
  |---          |---                              |
  | `id`        | Unique player identifier        |
  | `name`      | Player name                     |
  | `rank`      | Player rank                     |
  | `joined`    | Date the player joined          |
  | `weapon_id` | Reference to an assigned weapon |

### Weapons

 Stores available weapon information.

  | Column        | Description              |
  |---            |---                       |
  | `id`          | Unique weapon identifier |
  | `weapon_name` | Weapon name              |
  | `damage`      | Weapon damage value      |

### Inventory

 Stores inventory records connecting players and weapons.

  | Column      | Description                        |
  |---          |---                                 |
  | `id`        | Unique inventory record identifier |
  | `player_id` | Reference to a player              |
  | `weapon_id` | Reference to a weapon              |

 Foreign keys connect the tables and help maintain relational data integrity.

## API Endpoints

 The API provides endpoints for managing player data.

### Players

  | Method   | Endpoint       | Description               |
  |---       |---             |---                        |
  | `GET`    | `/players`     | Retrieve all players      |
  | `GET`    | `/players/:id` | Retrieve a player by ID   |
  | `POST`   | `/players`     | Create a new player       |
  | `PUT`    | `/players/:id` | Update an existing player |
  | `DELETE` | `/players/:id` | Delete a player           |

### Example Requests

  Retrieve all players:

    GET /players

  Retrieve a player by ID:

    GET /players/1

  Create a player:

    POST /players
    Content-Type: application/json

  Update a player:

    PUT /players/1
    Content-Type: application/json

  Delete a player:

    DELETE /players/1

 The API uses JSON for request and response data.

## Docker Setup

 The application and PostgreSQL database are managed using Docker Compose.

### Start the Application

 Build the Docker image and start the services:

   ```bash
   docker compose up -d --build
   ```
 This starts the following services:

 - `project8-api` — Express.js API
 - `project8-db` — PostgreSQL database

### Check Running Containers

   ```bash
   docker compose ps
   ```

### View API Logs
 
   ```bash
   docker compose logs -f api
   ```

### Stop the Application

   ```bash
   docker compose stop
   ```

### Restart the API

   ```bash
   docker compose restart api
   ```

### Rebuild After Code Changes

 When application source code or Docker configuration changes:

   ```bash
   docker compose up -d --build
   ```
 
 The PostgreSQL database uses the `postgres_data` Docker volume for persistent storage.
 This allows the database data to remain available when containers are recreated.

- **Note**: Avoid using `docker compose down -v` unless you intentionally want to delete the PostgreSQL data volume.

## Environment Variables

 The application uses environment variables for database configuration.

 Create a `.env` file in the project root with the following variables:

   ```bash
   DB_HOST=postgres
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=game_db
   ```

  | Variable      | Description                                                       |
  |---            |---                                                                |
  | `DB_HOST`     | PostgreSQL host. Uses the Docker Compose service name `postgres`. |
  | `DB_PORT`     | PostgreSQL port.                                                  |
  | `DB_USER`     | PostgreSQL username.                                              |
  | `DB_PASSWORD` | PostgreSQL password.                                              |
  | `DB_NAME`     | PostgreSQL database name.                                         |

 The `.env` file contains environment-specific configuration and should not be committed
 to the repository.

## Backup & Restore

### Backup

 Create a PostgreSQL database backup using `pg_dump`:
   ```bash
   mkdir -p backups

   BACKUP_FILE="backups/game_db_$(date +%F_%H%M%S).sql"
   TEMP_FILE="${BACKUP_FILE}.tmp"

   if sudo docker compose exec -T postgres pg_dump -U postgres -d game_db > "$TEMP_FILE" && test -s "$TEMP_FILE"; then
      mv "$TEMP_FILE" "$BACKUP_FILE"
      echo "Backup completed successfully: $BACKUP_FILE"
      ls -lh "$BACKUP_FILE"
   else
      rm -f "$TEMP_FILE"
      echo "Backup failed."
      exit 1
   fi
   ```
 The backup is stored as an SQL dump in the `backups/` directory.

### Restore

 Restore the backup into a separate test database to avoid overwriting the original `game_db` database.

 Create the test database:
   ```bash
   sudo docker compose exec -T postgres createdb -U postgres game_db_restore_test
   ```
 Restore the backup using the actual backup filename:
   ```bash
   sudo docker compose exec -T postgres psql -X -v ON_ERROR_STOP=1 -U postgres -d game_db_restore_test < backups/game_db_YYYY-MM-DD_HHMMSS.sql
   ```
 Replace `game_db_YYYY-MM-DD_HHMMSS.sql` with the actual filename in the `backups/` directory.

### Restore Verification

 The backup was successfully restored into a separate test database.
 The restored database contained the same number of records as the original database.

  | Table       | Records |
  |---          |---      |
  | `players`   | 13      |
  | `weapons`   | 10      |
  | `inventory` | 38      |

 The original `game_db` database was not overwritten during the restore test.

- **Note**: A complete project backup should include the PostgreSQL database dump in addition to the application source code and configuration files.
  Store database backups separately from the project files because GitHub does not automatically back up the live PostgreSQL database.


## Project Structure

 ```text
 express-postgres-api/
 ├── config/
 │   └── db.js
 ├── controllers/
 │   └── playersController.js
 ├── middleware/
 │   └── errorHandler.js
 ├── routes/
 │   └── players.js
 ├── .dockerignore
 ├── .env.example
 ├── .gitignore
 ├── Dockerfile
 ├── compose.yaml
 ├── package.json
 ├── package-lock.json
 ├── README.md
 └── server.js
```

### Directory Overview

  | Directory / File | Purpose                                                          |
  |---               |---                                                               |
  | `config/`        | PostgreSQL database connection configuration                     |
  | `controllers/`   | Handles player-related application logic and database operations |
  | `middleware/`    | Request logging, 404 handling, and centralized error handling    |
  | `routes/`        | Defines API endpoints                                            |
  | `Dockerfile`     | Defines the API container image                                  |
  | `compose.yaml`   | Defines the API and PostgreSQL services                          |
  | `server.js`      | Initializes the Express application                              |
  | `.env.example`   | Provides a template for the required environment variables       |
  | `.dockerignore`  | Excludes unnecessary files from the Docker build context         |
  | `.gitignore`     | Prevents sensitive and unnecessary files from being committed    |
  | `README.md`      | Project documentation                                            |

## How to Run

### Prerequisites

 Make sure the following are installed:

 - Git
 - Docker Engine
 - Docker Compose

### Clone the Repository
   ```bash
   git clone https://github.com/raihanwirawan/express-postgres-api.git
   cd express-postgres-api
   ```
### Configure Environment Variables

 Create your local environment configuration:
   ```bash
   cp .env.example .env
   ```
 Update `.env` with your database credentials before starting the application.

### Start the Application
   ```bash
   docker compose up -d --build
   ```
### Verify the Services
   ```bash
   docker compose ps
   ```
### Stop the Application
   ```bash
   docker compose stop
   ```
## Future Improvements
 Possible improvements for future development include:

 - Add authentication and authorization.
 - Add request validation.
 - Expand API endpoints for weapons and inventory management.
 - Add automated testing.
 - Add API documentation with Swagger or OpenAPI.
 - Add CI/CD automation.

## Author

 Developed by Raihan Wirawan

 This project was built to demonstrate practical experience
 with REST API  development, PostgreSQL database integration,
 Docker containerization, and Git-based version control.
