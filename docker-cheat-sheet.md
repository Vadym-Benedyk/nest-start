# 🐳 Docker Cheat Sheet

## 🔧 Робота з образами (Images)
```
docker build -t myapp .         # Збірка образу з Dockerfile
docker images                   # Список локальних образів
docker rmi <image_id>           # Видалення образу
docker pull <image>             # Завантаження з Docker Hub
docker push <myrepo/myimage>   # Завантаження у Docker Hub
```

## 📦 Робота з контейнерами
```
docker run -it <image>                  # Інтерактивний запуск контейнера
docker run -d -p 3000:3000 <image>      # Фоновий запуск з портами
docker ps                               # Запущені контейнери
docker ps -a                            # Усі контейнери
docker stop <container_id>             # Зупинка контейнера
docker start <container_id>            # Запуск зупиненого контейнера
docker restart <container_id>          # Перезапуск
docker rm <container_id>               # Видалення
docker exec -it <container_id> bash    # Bash у контейнері
docker logs <container_id>             # Логи
```

## 🧱 Docker Compose
```
docker-compose up                      # Запуск сервісів
docker-compose up -d                   # У фоні
docker-compose down                    # Зупинка + очищення
docker-compose build                   # Збірка вручну
docker-compose logs                    # Логи всіх сервісів
docker-compose exec <service> bash     # Вхід у контейнер
```

## 🧹 Очищення системи
```
docker system prune                    # Все непотрібне
docker image prune                     # Зайві образи
docker volume prune                    # Зайві томи
```

## 📁 Звичайні шляхи (для копіювання/зв’язування)
- `/app` – часто використовують як `WORKDIR` в Dockerfile
- `./data:/var/lib/postgresql/data` – том для БД у docker-compose