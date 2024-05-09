from django.contrib import admin
from .models import *

class FanLogAdmin(admin.ModelAdmin):
    list_display = ('status', 'timestamp')
    ordering = ('-timestamp',)

class FanAutoLogAdmin(admin.ModelAdmin):
    list_display = ('is_manual', 'timestamp')
    ordering = ('-timestamp',)

class FanThresholdLogAdmin(admin.ModelAdmin):
    list_display = ('threshold', 'timestamp')
    ordering = ('-timestamp',)

class LightLogAdmin(admin.ModelAdmin):
    list_display = ('status', 'timestamp')
    ordering = ('-timestamp',)

class SensorRecordAdmin(admin.ModelAdmin):
    list_display = ('sensor', 'value', 'timestamp')
    ordering = ('-timestamp',)

admin.site.register(SensorRecord, SensorRecordAdmin)
admin.site.register(Light)
admin.site.register(Fan)
admin.site.register(Schedule)
admin.site.register(FanLog, FanLogAdmin)
admin.site.register(FanAutoLog, FanAutoLogAdmin)
admin.site.register(FanThresholdLog, FanThresholdLogAdmin)
admin.site.register(LightLog, LightLogAdmin)