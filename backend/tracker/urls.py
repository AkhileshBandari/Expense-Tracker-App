from django.urls import path
from .views import *

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('add-budget/', add_budget),
    path('add-expense/', add_expense),
    path('dashboard/', dashboard),
    path('category-analysis/', category_analysis),
]