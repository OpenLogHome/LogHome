from kimi_client import KimiClient
import os

def main():
    # Get API key from environment variable or input
    api_key = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ1c2VyLWNlbnRlciIsImV4cCI6MTc2MDA4NzkxMSwiaWF0IjoxNzUyMzExOTExLCJqdGkiOiJkMXAyZ3B0anFlZDdpZ212c29mZyIsInR5cCI6InJlZnJlc2giLCJhcHBfaWQiOiJraW1pIiwic3ViIjoiZDFwMmdwdGpxZWQ3aWdtdnNvZWciLCJzcGFjZV9pZCI6ImQxcDJncHRqcWVkN2lnbXZzb2UwIiwiYWJzdHJhY3RfdXNlcl9pZCI6ImQxcDJncHRqcWVkN2lnbXZzb2RnIiwic3NpZCI6IjE3MzAzMTAyNDQ3MzQyOTA1MDIiLCJkZXZpY2VfaWQiOiI3NDQ3NTE4NTc3Mzk5MjY4ODczIiwicmVnaW9uIjoiY24ifQ.j3YRQSZjRGzN32IWOUI7zVGrJBn5zuewqb9LznEH3slA0J_r5K2gay-gO9rqzgAY3fUlsEe90Gtr721naqLscw"
    
    # Create a client instance
    client = KimiClient(api_key, "http://8.152.99.246:8000/")
    
    print("Welcome to the Kimi API Demo!")
    print("Type 'exit' to quit, 'clear' to start a new conversation.")
    print("Special commands: 'image:[url]' to analyze an image, 'doc:[url]' to analyze a document")
    print("-" * 50)
    
    while True:
        # Get user input
        user_input = input("\nYou: ")
        
        # Check for exit command
        if user_input.lower() == "exit":
            break
        
        # Check for clear conversation command
        if user_input.lower() == "clear":
            client.clear_conversation()
            print("Conversation cleared.")
            continue
        
        # Check for image analysis command
        if user_input.startswith("image:"):
            image_url = user_input[6:].strip()
            print(f"Analyzing image: {image_url}")
            
            try:
                response = client.analyze_image(image_url)
                content = client.get_last_response(response)
                if content:
                    print(f"\nKimi: {content}")
                else:
                    print(f"\nError: {response}")
            except Exception as e:
                print(f"\nError: {e}")
            continue
        
        # Check for document analysis command
        if user_input.startswith("doc:"):
            doc_url = user_input[4:].strip()
            print(f"Analyzing document: {doc_url}")
            
            try:
                response = client.analyze_document(doc_url)
                content = client.get_last_response(response)
                if content:
                    print(f"\nKimi: {content}")
                else:
                    print(f"\nError: {response}")
            except Exception as e:
                print(f"\nError: {e}")
            continue
        
        # Regular chat interaction
        try:
            response = client.chat(user_input)
            content = client.get_last_response(response)
            if content:
                print(f"\nKimi: {content}")
            else:
                print(f"\nError: {response}")
        except Exception as e:
            print(f"\nError: {e}")

if __name__ == "__main__":
    main() 