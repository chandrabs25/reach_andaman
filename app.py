import os

def create_txt_file(file_name):
    """Create a new empty text file."""
    try:
        with open(file_name, 'w') as file:
            file.write('')  # Create an empty file
        return f"File '{file_name}' created successfully."
    except Exception as e:
        return f"An error occurred: {e}"

def find_all_files_in_codebase(directory):
    """Find all files in the given directory and its subdirectories."""
    file_paths = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_paths.append(os.path.join(root, file))
    return file_paths

def write_code_to_txt(file_paths, output_file):
    """Write the contents of each file to the output file."""
    try:
        with open(output_file, 'a') as out_file:  # Open in append mode
            for file_path in file_paths:
                try:
                    with open(file_path, 'r') as in_file:
                        out_file.write(f"Path: {file_path}\n")
                        out_file.write(in_file.read())
                        out_file.write("\n\n")
                except Exception as e:
                    out_file.write(f"Path: {file_path}\nError reading file: {e}\n\n")
        return f"Code written to '{output_file}' successfully."
    except Exception as e:
        return f"An error occurred: {e}"

# Example usage
output_file = 'codebase_contents.txt'
print(create_txt_file(output_file))
directory = '.'  # Current directory, change this to your codebase path
file_paths = find_all_files_in_codebase(directory)
print(f"Found {len(file_paths)} files")
print(write_code_to_txt(file_paths, output_file))
