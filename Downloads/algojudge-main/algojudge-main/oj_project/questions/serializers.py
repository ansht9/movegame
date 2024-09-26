from rest_framework import serializers
from .models import Question,TestCase


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"

class TestCaseSerializer(serializers.ModelSerializer):
    questionCode = serializers.CharField(write_only=True)

    class Meta:
        model = TestCase
        fields = ['input', 'output', 'question', 'questionCode']
        extra_kwargs = {'question': {'read_only': True}}

    def create(self, validated_data):
        question_code = validated_data.pop('questionCode')
        try:
            question = Question.objects.get(code=question_code)
        except Question.DoesNotExist:
            raise serializers.ValidationError("Invalid question code.")
        
        test_case = TestCase.objects.create(question=question, **validated_data)
        return test_case