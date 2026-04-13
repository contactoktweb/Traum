with open("components/CartSidebar.tsx", "r") as f:
    lines = f.readlines()

with open("components/CartSidebar.tsx", "w") as f:
    for line in lines:
        if 'import Image from "next/image"' not in line:
            f.write(line)
