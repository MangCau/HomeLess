from django.contrib import admin
from .models import *

class ActivityLogAdmin(admin.ModelAdmin):
    # Define the list display fields
    list_display = ('type', 'status', 'timestamp')

    # Define the ordering
    ordering = ('-timestamp',)

class SensorRecordAdmin(admin.ModelAdmin):
    # Define the list display fields
    list_display = ('sensor', 'value', 'timestamp')

    # Define the ordering
    ordering = ('-timestamp',)

# Register your model with the custom admin class
admin.site.register(SensorRecord, SensorRecordAdmin)
admin.site.register(Light)
admin.site.register(Fan)
admin.site.register(Schedule)
admin.site.register(ActivityLog, ActivityLogAdmin)