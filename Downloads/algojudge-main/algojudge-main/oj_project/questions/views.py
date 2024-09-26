import os
import uuid
import logging
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Question, TestCase, Solution
from .serializers import QuestionSerializer, TestCaseSerializer
import subprocess


class QuestionListAPIView(generics.ListAPIView):
    queryset = Question.objects.filter(is_approved=True)
    serializer_class = QuestionSerializer
    authentication_classes = [JWTAuthentication]  # Use JWT authentication
    permission_classes = [IsAuthenticated]  # Require authentication to access the API


class QuestionDetailAPIView(generics.RetrieveAPIView):
    queryset = Question.objects.filter(is_approved=True)
    serializer_class = QuestionSerializer
    lookup_field = "code"
    authentication_classes = [JWTAuthentication]  # Use JWT authentication
    permission_classes = [IsAuthenticated]

class SubmitQuestionAPIView(APIView):
    authentication_classes = [JWTAuthentication]  # Use JWT authentication
    permission_classes = [IsAuthenticated]

    def post(self, request):
        question_serializer = QuestionSerializer(data=request.data)
        if question_serializer.is_valid():
            question = question_serializer.save()
            return Response(
                {"message": "Question submitted successfully", "question": question_serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(question_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubmitTestCaseAPIView(APIView):
    # authentication_classes = [JWTAuthentication]  # Use JWT authentication
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        test_case_serializer = TestCaseSerializer(data=request.data)
        if test_case_serializer.is_valid():
            test_case_serializer.save()
            return Response(
                {"message": "Test case submitted successfully", "test_case": test_case_serializer.data},
                status=status.HTTP_201_CREATED
            )
        else:
            # Log errors
            print(test_case_serializer.errors)
        return Response(test_case_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class ExecuteCodeAPIView(APIView):
    authentication_classes = [JWTAuthentication]  # Use JWT authentication
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            lang = request.data.get("lang")
            question_code = request.data.get("question_code")
            code = request.data.get("code")

            logger.debug(f"Received request to execute code in language: {lang}")

            if lang not in ["c", "cpp", "py", "java"]:
                return Response(
                    {"error": "Invalid language"}, status=status.HTTP_400_BAD_REQUEST
                )

            folder_name = "InputCodes"
            output_folder_name = "Output"

            os.makedirs(folder_name, exist_ok=True)
            os.makedirs(output_folder_name, exist_ok=True)

            curr_dir = os.getcwd()
            folder_path = os.path.join(curr_dir, folder_name)
            uniquename = uuid.uuid4().hex
            unique_filename = f"{uniquename}.{lang}"
            file_path = os.path.join(folder_path, unique_filename)

            with open(file_path, "w") as f:
                f.write(code)

            logger.debug(f"Code written to file: {file_path}")

            question = Question.objects.filter(code=question_code).first()
            if not question:
                return Response(
                    {"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND
                )

            test_case = TestCase.objects.filter(question=question).first()
            if not test_case:
                return Response(
                    {"error": "Test case not found"}, status=status.HTTP_404_NOT_FOUND
                )

            input_file_path = os.path.join(curr_dir, "oj_project", "testcaseinput", test_case.input)
            output_file_path = os.path.join(curr_dir, "oj_project", "testcaseoutput", test_case.output)
            temp_output_file_path = os.path.join(curr_dir, output_folder_name, f"{uniquename}.txt")

            try:
                if lang == "c":
                    result = subprocess.run(
                        ["gcc", file_path, "-o", os.path.join(folder_path, uniquename)],
                        capture_output=True, text=True
                    )
                    logger.debug(f"GCC output: {result.stdout}")
                    logger.debug(f"GCC error: {result.stderr}")
                    if result.returncode != 0:
                        raise Exception(f"Compilation failed: {result.stderr}")
                    with open(input_file_path, "r") as input_file:
                        with open(temp_output_file_path, "w") as output_file:
                            subprocess.run(
                                [os.path.join(folder_path, uniquename)],
                                stdin=input_file,
                                stdout=output_file,
                            )

                elif lang == "cpp":
                    result = subprocess.run(
                        ["g++", file_path, "-o", os.path.join(folder_path, uniquename)],
                        capture_output=True, text=True
                    )
                    logger.debug(f"G++ output: {result.stdout}")
                    logger.debug(f"G++ error: {result.stderr}")
                    if result.returncode != 0:
                        raise Exception(f"Compilation failed: {result.stderr}")
                    with open(input_file_path, "r") as input_file:
                        with open(temp_output_file_path, "w") as output_file:
                            subprocess.run(
                                [os.path.join(folder_path, uniquename)],
                                stdin=input_file,
                                stdout=output_file,
                            )

                elif lang == "py":
                    with open(input_file_path, "r") as input_file:
                        with open(temp_output_file_path, "w") as output_file:
                            result = subprocess.run(
                                ["python3", file_path],
                                stdin=input_file,
                                stdout=output_file,
                                stderr=subprocess.PIPE,
                                text=True
                            )
                            logger.debug(f"Python output: {result.stdout}")
                            logger.debug(f"Python error: {result.stderr}")
                            if result.returncode != 0:
                                raise Exception(f"Python execution failed: {result.stderr}")

                elif lang == "java":
                    compile_result = subprocess.run(["javac", file_path], capture_output=True, text=True)
                    logger.debug(f"Javac output: {compile_result.stdout}")
                    logger.debug(f"Javac error: {compile_result.stderr}")
                    if compile_result.returncode != 0:
                        raise Exception(f"Compilation failed: {compile_result.stderr}")
                    class_filename = unique_filename.replace(".java", "")
                    with open(input_file_path, "r") as input_file:
                        with open(temp_output_file_path, "w") as output_file:
                            result = subprocess.run(
                                ["java", "-cp", folder_path, class_filename],
                                stdin=input_file,
                                stdout=output_file,
                                stderr=subprocess.PIPE,
                                text=True
                            )
                            logger.debug(f"Java output: {result.stdout}")
                            logger.debug(f"Java error: {result.stderr}")
                            if result.returncode != 0:
                                raise Exception(f"Java execution failed: {result.stderr}")

                with open(temp_output_file_path, "r") as gen_file:
                    generated_output = gen_file.read()

                with open(output_file_path, "r") as ref_file:
                    reference_output = ref_file.read()

                verdict = "Accepted" if generated_output.strip() == reference_output.strip() else "Wrong Answer"

                # Create a Solution instance and save it to the database
                Solution.objects.create(
                    question=question,
                    verdict=verdict
                )

                return Response(
                    {"output": generated_output, "result": verdict},
                    status=status.HTTP_200_OK,
                )
            except Exception as e:
                logger.error(f"Error during code execution: {e}")
                return Response(
                    {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
