---
notion-id: 3c0737bad00c80eba8bfe7f4ca3f7122
---
LCEL은 LangChain Expression Language의 약자로, 여러 컴포넌트를 연결해서 하나의 파이프라인(체인)을 만드는 문법이다. `|` 연산자를 통해 각 컴포넌트를 연결할 수 있다.

```python
chain = prompt | llm | output_parser
```

기본적인 형태는 이렇게 되고, 흐름은 사용자 입력을 받으면 prompt → LLM → Output으로 이어진다. `|` 기준으로 왼쪽의 출력값을 오른쪽의 입력값으로 넘기게 된다.

이때 LCEL을 이해하기 위해서 제일 중요한 개념은 Runnable인데, LangChain의 주요 컴포넌트들은 모두 Runnable 인터페이스를 구현해야 서로 연결해서 사용할 수 있게 된다. Runnable들은 공통적으로 `.invoke()`, `.batch()`, `.stream()`을 통해 실행할 수 있다.

이렇게 Runnable끼리 연결한 것을 새로운 Runnable, 즉 Runnable Chain이 된다. 그래서 `chain.invoke()`도 가능하다. chain도 Runnable 객체라서 LCEL로 chain끼리 연결하는 것도 가능하다.