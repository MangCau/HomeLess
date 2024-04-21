from django.contrib import admin
from .models import *

admin.site.register(SensorRecord)
admin.site.register(Light)
admin.site.register(Fan)
admin.site.register(Schedule)
admin.site.register(ActivityLog)