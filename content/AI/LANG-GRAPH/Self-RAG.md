---
notion-id: 3cd737bad00c807fb3d8f571ecaaa4d6
created: 2026-08-31T12:20:00+09:00
---
Self-RAG는 LLM이 단순히 검색하고 답변하는 수준이 아니라, 검색이 필요한지 판단하고 → 검색된 문서가 적절한지 평가하고 → 생성된 답변이 근거에 맞는지 스스로 검증하는 RAG 방식을 의미한다. 즉 검색부터 답변 생성까지 스스로 판단하고 평가하면서 진행되는 RAG 방식이다.

## 일반적인 RAG와의 차이점

일반적인 RAG는 보통 다음과 같은 고정된 흐름을 가진다.

```
질문
→ 문서 검색
→ 검색 문서를 Context로 전달
→ 답변 생성
```

이 경우에는 검색된 문서가 실제 질문과 관련이 없더라도 답변 생성에 사용된다. 반면에 Self-RAG는 일반적인 RAG와 다르게 다음과 같이 중간 결과를 평가하는 과정을 가진다.

```
Document 1
→ 질문과 관련 있음 ✅

Document 2
→ 질문과 관련 없음 ❌
```

평가를 통해 관련성이 낮은 문서는 제거하거나, 검색 결과 전체가 부족하다면 질문을 수정해서 다시 검색할 수 있다. 문서가 아니더라도 LLM이 생성한 답변 자체도 다시 평가할 수 있다.

## Self-RAG의 대표적인 3가지 평가

- Retrieval Grader: 검색된 문서가 관련 있는가? (질문 ↔ 문서)
- Hallucination Grader: 답변이 검색 문서에 근거하는가? (문서 ↔ 답변)
- Answer Grader: 답변이 질문을 제대로 해결하는가? (답변 ↔ 질문)

이렇게 대표적인 3가지의 평가를 통해 Self-RAG 방법을 구현할 수 있다.  
→ [[LangGraph에서 Self-RAG 구현하기]]

## Self-RAG의 보편적인 그래프 모형

```mermaid
flowchart TD
    START([__start__]) --> A[search_menu]

    A --> B[grade_documents]

    B -.->|관련 문서 있음| C[generate]
    B -.->|관련 문서 없음| D[transform_query]

    D --> A

    C -.->|useful| END([__end__])
    C -.->|not useful| D
    C -.->|not supported| C
```

“”검색 → 평가 → 생성 → 평가” 과정을 반복하면서 재검색•질문 재작성•재생성 등의 [[Feedback Loop]]을 수행하게 된다.