import random

# 随机执行函数
def probably_do(probability: float, callable: callable) -> bool:
    """
    以指定概率执行函数
    
    Args:
        probability: 执行概率，0到1之间的浮点数
        callable: 要执行的函数
        
    Returns:
        bool: 如果函数被执行则返回True，否则返回False
    """
    if random.random() < probability:
        callable()
        return True
    return False

def roll_probability(probability: float) -> bool:
    """
    以指定概率返回True
    
    Args:
        probability: 执行概率，0到1之间的浮点数
        
    Returns:
        bool: 如果函数被执行则返回True，否则返回False
    """
    return probably_do(probability, lambda: None)