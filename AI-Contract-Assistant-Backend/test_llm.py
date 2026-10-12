from app.services.llm_service import LLMService


llm_service = LLMService()

question = "What is a contract?"

context = """
A contract is a legally binding agreement between two or more parties.
It defines the rights and obligations of the parties involved.
"""

print("QUESTION:")
print(question)

print("\nANSWER:")
answer = llm_service.generate_answer(
    question=question,
    context=context,
)

print(answer)