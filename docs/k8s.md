## Audo apply secrets and configmap from scripts to namespace

### On linux

```sh
bash tools/k8s/create-secret-map.sh dev
```
```sh
bash tools/k8s/create-secret-map.sh prod --namespace default
```
```sh
bash tools/k8s/create-secret-map.sh dev --env-file ./.env.dev.k8s --namespace default
```

### On windows

```bash
powershell -File tools\k8s\create-secret-map.ps1 dev
```

```bash
powershell -File tools\k8s\create-secret-map.ps1 dev -Namespace default
```

```bash
powershell -File tools\k8s\create-secret-map.ps1 dev -EnvFile .\.env.dev.k8s -Namespace my-namespace
```