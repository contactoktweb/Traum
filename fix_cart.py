import re

with open("components/CartSidebar.tsx", "r") as f:
    content = f.read()

content = content.replace(
    'onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}',
    'onClick={() => updateQuantity(item.id, item.size || "", Math.max(1, item.quantity - 1))}'
)

content = content.replace(
    'onClick={() => updateQuantity(item.id, item.quantity + 1)}',
    'onClick={() => updateQuantity(item.id, item.size || "", item.quantity + 1)}'
)

content = content.replace(
    'onClick={() => removeFromCart(item.id)}',
    'onClick={() => removeFromCart(item.id, item.size || "")}'
)

with open("components/CartSidebar.tsx", "w") as f:
    f.write(content)
