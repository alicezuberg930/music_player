## clean cache
# docker system prune -a --volumes

## Basic commands
# docker compose up                    # Start services in foreground
# docker compose up -d                 # Start services in detached mode (background)
# docker compose up --build            # Rebuild images before starting
# docker compose up -d --build         # Rebuild and start in background

## Scaling and selection
# docker compose up --scale SERVICE=NUM   # Scale a service to NUM instances
# docker compose up SERVICE1 SERVICE2     # Start specific services only
# docker compose up --profile PROFILE     # Start services with specific profile

## Build options
# docker compose up --no-build         # Don't build images, use existing
# docker compose up --force-recreate   # Recreate containers even if config unchanged
# docker compose up --no-recreate      # Don't recreate existing containers
# docker compose up --build --no-cache # Rebuild without using cache

## Output and logging
# docker compose up --quiet-pull       # Pull without printing progress
# docker compose up --no-log-prefix    # Don't print container name in logs
# docker compose up --timestamps       # Show timestamps in logs

## Resource management
# docker compose up --remove-orphans   # Remove containers for services not in compose file
# docker compose up --no-deps          # Don't start linked services
# docker compose up --abort-on-container-exit  # Stop all if any container stops

## Other useful combinations
# docker compose up -d --build --remove-orphans    # Full rebuild, background, cleanup
# docker compose up --build --force-recreate       # Force complete rebuild
# docker compose up --profile prod --build -d      # Production profile, build, detached
