from rest_framework import serializers
from .models import Expense, MonthlyBudget

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyBudget
        fields = '__all__'