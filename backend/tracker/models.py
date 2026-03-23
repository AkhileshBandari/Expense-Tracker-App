from django.db import models
from django.contrib.auth.models import User

class MonthlyBudget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    month = models.IntegerField()
    year = models.IntegerField()
    income = models.FloatField()

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    budget = models.ForeignKey(MonthlyBudget, on_delete=models.CASCADE)
    text = models.CharField(max_length=100)
    amount = models.FloatField()
    category = models.CharField(max_length=20)
    date = models.DateField()