from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Expense, MonthlyBudget


# ================= AUTH =================

@api_view(['POST'])
def register(request):
    User.objects.create_user(
        username=request.data['username'],
        password=request.data['password']
    )
    return Response({'msg': 'user created'})


@api_view(['POST'])
def login(request):
    user = authenticate(
        username=request.data['username'],
        password=request.data['password']
    )

    if user is None:
        return Response({'error': 'Invalid credentials'})

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token)
    })


# ================= ADD / UPDATE INCOME =================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_budget(request):
    user = request.user

    month = request.data['month']
    year = request.data['year']
    income = request.data['income']

    budget, created = MonthlyBudget.objects.get_or_create(
        user=user,
        month=month,
        year=year,
        defaults={'income': income}
    )

    # 🔥 update if already exists
    if not created:
        budget.income = income
        budget.save()

    return Response({'msg': 'budget set'})


# ================= ADD EXPENSE =================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_expense(request):
    user = request.user

    month = request.data['month']
    year = request.data['year']

    # 🔥 auto-create budget if missing
    budget, _ = MonthlyBudget.objects.get_or_create(
        user=user,
        month=month,
        year=year,
        defaults={'income': 0}
    )

    Expense.objects.create(
        user=user,
        budget=budget,
        text=request.data['text'],
        amount=request.data['amount'],
        category=request.data['category'],
        date=request.data['date']
    )

    return Response({'msg': 'expense added'})


# ================= DASHBOARD =================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user

    budgets = MonthlyBudget.objects.filter(user=user)

    result = {}

    for b in budgets:
        expenses = Expense.objects.filter(budget=b)
        total = sum(e.amount for e in expenses)

        result[b.month] = {
            "income": b.income,
            "expense": total,
            "savings": b.income - total
        }

    return Response(result)


# ================= CATEGORY ANALYSIS =================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_analysis(request):
    user = request.user

    month = int(request.GET.get('month'))
    year = int(request.GET.get('year'))

    budget = MonthlyBudget.objects.filter(
        user=user, month=month, year=year
    ).first()

    if not budget:
        return Response({})

    expenses = Expense.objects.filter(budget=budget)

    result = {}

    for e in expenses:
        result[e.category] = result.get(e.category, 0) + e.amount

    return Response(result)