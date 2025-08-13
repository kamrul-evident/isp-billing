import os
from celery import Celery
from celery.schedules import crontab


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

# Create a Celery APP instance

cel_app = Celery("celery_app")

# Load settings from Django settings file (use a CELERY_ prefix)
cel_app.config_from_object("django.conf.settings", namespace="CELERY")

# Auto discover tasks from all registed Django configs
cel_app.autodiscover_tasks()

cel_app.beat_schedule = {
    # Run on 1st day of every month at 00:00
    "generate-bills-monthly": {
        "task": "customer.tasks.generate_customer_bills",
        "schedule": crontab(minute=0, hour=0, day_of_month=1),
    },
    # Run on 10th day of every month at 00:00
    "deactivate-customers-monthly": {
        "task": "customer.tasks.deactivate_due_payment_customers",
        "schedule": crontab(minute=0, hour=0, day_of_month=10),
    },
    # # Run every 1 minute
    # "add-task-every-minute": {
    #     "task": "customer.tasks.add",
    #     "schedule": crontab(minute="*/1"),  # every 1 minute
    #     "args": (2, 3),  # example arguments for add(x, y)
    # },
}


@cel_app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
