---
notion-id: 3c3737bad00c80e296b0c3e18c7a613f
created: 2026-08-21T19:18:00+09:00
---
Reducer는 LangGraph에서 상태 스키마를 업데이트를 관리하는 중요한 개념이다. 기본적으로 노드의 출력으로 상태 스키마에 그대로 덮어쓰기 때문에 과거 히스토리가 필요한 챗봇 기능에서는 별도의 Reducer가 필요하다. 3가지 Reducer에 대해 알아보자.

## 1. 기본 Reducer

```python
from typing import TypedDict, List
from langgraph.graph import StateGraph, START, END
from IPython.display import Image, display

# 상태 정의 
class DocumentState(TypedDict):
    query: str
    documents: List[str]

# Node 1: query 업데이트
def node_1(state: DocumentState) -> DocumentState:
    print("---Node 1 (query update)---")
    query = state["query"]
    return {"query": query}

# Node 2: 검색된 문서 추가 
def node_2(state: DocumentState) -> DocumentState:
    print("---Node 2 (add documents)---")
    return {"documents": ["doc1.pdf", "doc2.pdf", "doc3.pdf"]}

# Node 3: 추가적인 문서 검색 결과 추가
def node_3(state: DocumentState) -> DocumentState:
    print("---Node 3 (add more documents)---")
    return {"documents": ["doc2.pdf", "doc4.pdf", "doc5.pdf"]}


# 그래프 빌드
builder = StateGraph(DocumentState)
builder.add_node("node_1", node_1)
builder.add_node("node_2", node_2)
builder.add_node("node_3", node_3)

# 논리 구성
builder.add_edge(START, "node_1")
builder.add_edge("node_1", "node_2")
builder.add_edge("node_2", "node_3")
builder.add_edge("node_3", END)

# 그래프 컴파일
graph = builder.compile()
```

- Reducer를 별도로 지정하지 않은 경우에는 기본 Reducer가 적용된다.
	- 이전에 다룬 [[StateGraph]] 에서는 기본 Reducer를 사용했다.
- 기본 Reducer는 기존 값을 덮어쓰는 Override 방식으로 동작한다.

```python
# 초기 상태
initial_state = {"query": "채식주의자를 위한 비건 음식을 추천해주세요."}

# 그래프 실행 
final_state = graph.invoke(initial_state)

# 최종 상태 출력
print("최종 상태:", final_state)
	# ---Node 1 (query update)---
	# ---Node 2 (add documents)---
	# ---Node 3 (add more documents)---
	# 최종 상태: {'query': '채식주의자를 위한 비건 음식을 추천해주세요.', 'documents': ['doc2.pdf', 'doc4.pdf', 'doc5.pdf']}
```

- 출력 결과를 보면 누적이 되지 않고, 덮어쓰기 때문에 마지막 상태만 기록된다.
- 다만 이런 경우에는 챗봇과 같이 과거의 값들이 필요한 경우에 매우 불리하다.

## 2. 누적 Reducer

```python
from operator import add
from typing import Annotated, TypedDict

class ReducerState(TypedDict):
    query: str
    documents: Annotated[List[str], add]

# Node 1: query 업데이트
def node_1(state: ReducerState) -> ReducerState:
    print("---Node 1 (query update)---")
    query = state["query"]
    return {"query": query}

# Node 2: 검색된 문서 추가 
def node_2(state: ReducerState) -> ReducerState:
    print("---Node 2 (add documents)---")
    return {"documents": ["doc1.pdf", "doc2.pdf", "doc3.pdf"]}

# Node 3: 추가적인 문서 검색 결과 추가
def node_3(state: ReducerState) -> ReducerState:
    print("---Node 3 (add more documents)---")
    return {"documents": ["doc2.pdf", "doc4.pdf", "doc5.pdf"]}

# 그래프 빌드
builder = StateGraph(ReducerState)
builder.add_node("node_1", node_1)
builder.add_node("node_2", node_2)
builder.add_node("node_3", node_3)

# 논리 구성
builder.add_edge(START, "node_1")
builder.add_edge("node_1", "node_2")
builder.add_edge("node_2", "node_3")
builder.add_edge("node_3", END)

# 그래프 실행
graph = builder.compile()
```

- `Annotated`를 사용해서 reducer 작동 방식을 바꿀 수 있다.
	- 리스트를 병합하는 `operator.add`를 사용해서 누적하는 방식으로 변경했다.

```python
# 초기 상태
initial_state = {"query": "채식주의자를 위한 비건 음식을 추천해주세요."}

# 그래프 실행 
final_state = graph.invoke(initial_state)

# 최종 상태 출력
print("최종 상태:", final_state)
	# ---Node 1 (query update)---
	# ---Node 2 (add documents)---
	# ---Node 3 (add more documents)---
	# 최종 상태: {'query': '채식주의자를 위한 비건 음식을 추천해주세요.', 'documents': ['doc1.pdf', 'doc2.pdf', 'doc3.pdf', 'doc2.pdf', 'doc4.pdf', 'doc5.pdf']}
```

- 출력 결과를 보면 이번에는 모든 출력 상태들이 누적된 모습이다.

## 3. 커스텀 Reducer

```python
from typing import TypedDict, List, Annotated

# Custom reducer: 중복된 문서를 제거하며 리스트 병합
def reduce_unique_documents(left: list | None, right: list | None) -> list:
    """Combine two lists of documents, removing duplicates."""
    if not left:
        left = []
    if not right:
        right = []
    # 중복 제거: set을 사용하여 중복된 문서를 제거하고 다시 list로 변환
    return list(set(left + right))

# 상태 정의 (documents 필드 포함)
class CustomReducerState(TypedDict):
    query: str
    documents: Annotated[List[str], reduce_unique_documents]  # Custom Reducer 적용


# Node 1: query 업데이트
def node_1(state: CustomReducerState) -> CustomReducerState:
    print("---Node 1 (query update)---")
    query = state["query"]
    return {"query": query}

# Node 2: 검색된 문서 추가 
def node_2(state: CustomReducerState) -> CustomReducerState:
    print("---Node 2 (add documents)---")
    return {"documents": ["doc1.pdf", "doc2.pdf", "doc3.pdf"]}

# Node 3: 추가적인 문서 검색 결과 추가
def node_3(state: CustomReducerState) -> CustomReducerState:
    print("---Node 3 (add more documents)---")
    return {"documents": ["doc2.pdf", "doc4.pdf", "doc5.pdf"]}

# 그래프 빌드
builder = StateGraph(CustomReducerState)
builder.add_node("node_1", node_1)
builder.add_node("node_2", node_2)
builder.add_node("node_3", node_3)

# 논리 구성
builder.add_edge(START, "node_1")
builder.add_edge("node_1", "node_2")
builder.add_edge("node_2", "node_3")
builder.add_edge("node_3", END)

# 그래프 실행
graph = builder.compile()
```

- 상태 업데이트가 덮어쓰기나, 병합(누적)만으로 해결되지 않을 때 사용한다.
	- 중복 제거, 최대/최소 값 유지, 조건부 병합 등 여러 로직이 가능하다.
- 예시 기준으로는 중복을 제거하는 방식의 업데이트를 하도록 Reducer를 만들었다.

```python
# 초기 상태
initial_state = {"query": "채식주의자를 위한 비건 음식을 추천해주세요.", "documents": []}

# 그래프 실행 
final_state = graph.invoke(initial_state)

# 최종 상태 출력
print("최종 상태:", final_state)
	# ---Node 1 (query update)---
	# ---Node 2 (add documents)---
	# ---Node 3 (add more documents)---
	# 최종 상태: {'query': '채식주의자를 위한 비건 음식을 추천해주세요.', 'documents': ['doc1.pdf', 'doc4.pdf', 'doc3.pdf', 'doc2.pdf', 'doc5.pdf']}
```

- 출력을 보면 이번에는 중복이 없어진 것을 확인할 수 있다.

## 참고

[[StateGraph]]