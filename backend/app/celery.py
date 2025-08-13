import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

# Create a Celery APP instance

cel_app = Celery("celery_app")

# Load settings from Django settings file (use a CELERY_ prefix)
cel_app.config_from_object("django.conf.settings", namespace="CELERY")

# Auto discover tasks from all registed Django configs
cel_app.autodiscover_tasks()


@cel_app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
