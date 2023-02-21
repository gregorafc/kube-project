import os
import shutil
import tarfile
import time

base_path = os.path.abspath(os.path.dirname(__file__))

# Ścieżki do katalogów, które będą backupowane
data_dir = os.path.join(base_path, "storage/data")
logs_dir = os.path.join(base_path, "storage/logs")

# Ścieżki do katalogów backup i tmp
backup_dir = os.path.join(base_path, "archive/backup")
tmp_dir = os.path.join(base_path, "archive/tmp")

# Sprawdzanie czy katalogi data i logs istnieją
if not os.path.exists(data_dir) or not os.path.exists(logs_dir):
    print("Backup niemożliwy - brakuje katalogów data i/lub logs")
    exit()

# Sprawdzanie czy katalogi backup i tmp istnieją, jeśli nie - tworzenie ich
if not os.path.exists(backup_dir):
    os.makedirs(backup_dir)
if not os.path.exists(tmp_dir):
    os.makedirs(tmp_dir)

# Kopiowanie katalogów storage i logs do katalogu tmp
shutil.copytree(data_dir, os.path.join(tmp_dir, "data"))
shutil.copytree(logs_dir, os.path.join(tmp_dir, "logs"))

# Tworzenie pliku tar z archiwizacją katalogów storage i logs
timestamp = time.strftime("%Y-%m-%d_%H-%M-%S")
backup_filename = f"backup_{timestamp}.tar.gz"
with tarfile.open(os.path.join(backup_dir, backup_filename), "w:gz") as tar:
    tar.add(tmp_dir, arcname=os.path.basename(tmp_dir))

# Usuwanie zawartości katalogu tmp
shutil.rmtree(tmp_dir)

print("Backup wykonano")
