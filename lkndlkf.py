def round_robin_schedule(elements):
    n = len(elements)
    if n % 2 == 1:
        elements.append(n)  # Add virtual element

    for _ in range(n - 1):  # Generate n-1 rounds
        print(f"round {_+1}")
        for i in range(n // 2):
            print(f"{elements[i]},{elements[n-i-1]}")
        elements.insert(1, elements.pop())  # Rotate the elements

# Example usage
teams = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"]
round_robin_schedule(teams)