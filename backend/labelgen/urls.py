from django.urls import path
from . import views

urlpatterns = [
    path('', views.label_list, name='label-list'),
    path('', views.add_label, name='add_label'),
]