---
notion-id: 3c1737bad00c809a8ee6c618e7fa1210
created: 2026-08-19T17:18:00+09:00
---
StateGraph는 State를 기반으로 작동하는 그래프 구조를 의미한다. 이 그래프의 특징으로는 Node가 특정 상태를 나타내며, Edge가 상태 간 전이 조건을 정의한다. 이 그래프를 사용하기 전에 핵심 구성 요소부터 알아보자.

## 1. 상태 (State)

그래프가 실행되는 동안 여러 Node가 상태를 공유하는 데이터 저장소다.

### 1.1. 상태 스키마 정의하기

```python
from typing_extensions import TypedDict

class State(TypedDict):
    question: str
    documents: list
    answer: str
```

- `TypedDict`를 사용해서 상태를 정의할 수 있다.
- `graph = StateGraph(State)`를 통해 공유할 데이터 형식을 넘긴다.
	- 또는 노드에 인자로 전달할 수도 있다.

## 2. 노드 (Node)

실제로 어떤 작업을 수행하는 함수다.

### 2.1. 노드 정의하기

```python
def search_node(state: State):
    question = state["question"]

    docs = search(question)

    return {
        "documents": docs
    }
```

- 이때 중요한 점은 전체 State를 반환할 필요가 없다.
- 필요한 부분만 반환하면 그 부분만 LangGraph가 기존 상태에 업데이트한다.

### 2.2. 그래프에 노드 추가하기

```python
# 그래프 빌더 생성
graph = StateGraph(State)

# 그래프에 노드 추가
graph.add_node("search", search_node)
graph.add_node("generate", generate_node)
```

- 노드를 정의하고 나면 그래프에 직접 등록해 주어야 한다.
	- 만들기만 한다고 해서 그래프의 노드가 되는 것이 X
	- 직접 `.add_node(노드이름, 함수)`를 통해 그래프에 등록해야 함.
- 참고로 그래프의 시작과 끝을 나타내는 Node는 별도로 제공해 준다.
	- 추상화된 START / END 노드를 기본으로 제공함.

## 3. 엣지 (Edge)

Edge는 Node와 Node를 연결하는 선을 의미한다.

### 3.1. 기본 Edge

```python
graph.add_edge("search", "generate")
```

- search → generate로의 연결선이 생기게 된다.

```python
graph.add_edge(START, "search")
graph.add_edge("search", "generate")
graph.add_edge("generate", END)
```

- START → search → generate → END 순서로 그래프가 생기게 된다.

### 3.2. 조건부 Edge

```python
def route(state_arg):
    if state_arg["need_process"]:
        return "yes"
    return "no"
```

- 어느 Edge를 탈지 결정하는 함수가 필요하다.
	- 넘겨준 상태 매개변수의 `need_process` 값에 따라 분기하게 된다.
	- 이때 `route`는 Node는 아니고, 일반적인 if-else 함수라고 보면 된다.

```python
graph.add_conditional_edges(
    "check",
    route,
    {
        "yes": "process",
        "no": END
    }
)
----------------------------------------------------------------------------------------------------
[분기 구조]
        ┌→ process
check ──┤
        └→ END
```

- `check` 노드 다음에 `route` 함수의 값에 따라 2가지의 분기를 가지게 된다.