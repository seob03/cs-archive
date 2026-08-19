---
notion-id: 3c1737bad00c80c7ae8fc19e927740e9
created: 2026-08-19T12:18:00+09:00
---
로컬 메뉴판 텍스트 파일을 기반으로 문서 단위로 분리한 뒤, 임베딩 모델로 벡터값으로 변환하여 Chroma에 저장한 뒤, 사용자 질문을 벡터 검색하여 관련 메뉴를 반환해 보자.

## 1. 벡터 저장소 생성

```python
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings

embeddings = OllamaEmbeddings(
    model="bge-m3"
)
# 처음 생성하는 경우
vector_db = Chroma.from_documents(
    documents=menu_documents,
    embedding=embeddings,
    collection_name="restaurant_menu",
    persist_directory="./chroma_db",
)
```

- `menu_documents`: 저장할 메뉴 문서 배열 (메뉴별로 나눠둔 문서 배열)
- `bge-m3`: 문서와 질문을 벡터로 변환하는 임베딩 모델
- `restaurant_menu`: Chroma 컬렉션 이름
- `./chroma_db`: 벡터 DB 저장 위치

```python
# 이미 생성했던 경우
vector_db = Chroma(
    embedding_function=embeddings,
    collection_name="restaurant_menu",
    persist_directory="./chroma_db",
)
```

- 만들어둔 Chroma를 다시 사용할 때는 `from_documents()`를 사용하지 않는다.

## 2. Retriever 생성

```python
retriever = vector_db.as_retriever(
    search_kwargs={"k": 2}
)
```

- 질문과 의미적으로 가까운 문서 2개를 검색하도록 설정한다.

## 3. RAG Chain 생성 및 호출

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

def format_docs(docs):
    return "\n\n".join(
        doc.page_content for doc in docs
    )

prompt = ChatPromptTemplate.from_template("""
당신은 레스토랑 메뉴 안내 assistant입니다.

아래 검색된 메뉴 정보만 참고하여 질문에 답변하세요.
검색 결과에 없는 정보는 추측하지 말고 모른다고 답변하세요.

[검색된 메뉴 정보]
{context}

[사용자 질문]
{question}

답변:
""")

llm = ChatOpenAI(
    model="gpt-4o-mini"
)

rag_chain = (
    {
        "context": retriever | format_docs,
        "question": RunnablePassthrough(),
	  } | prompt | llm | StrOutputParser()
)

query = "시그니처 스테이크의 가격과 특징은 무엇인가요?"
answer = rag_chain.invoke(query)
print(answer)
```

1. 질문을 인자로 `rag_chain`이 호출된다.
2. 입력을 두 갈래로 분기한다.
	- `context`
		- 질문을 `retriever`에 전달해서 검색
		- 검색 결과로 관련 Doc 2개를 받아온다.
		- `format_docs`을 통해 하나의 문자열로 합쳐둔다.
	- `question`
		- `RunnablePassthrough()`: 입력을 들어온 질문을 그대로 보관
3. `context`와 `question` 두 결과가 하나의 딕셔너리가 된 채로 `prompt`에 전달
4. 해당 `prompt`에 연결한 인자값이 들어간 채로 `llm`에 입력되고, 답변을 받아온다.
	- LCEL 방법을 통해 자동으로 출력값이 그 다음 Runnable의 입력값이 된다.
5. `AIMessage` 객체에서 `StrOutputParser`로 `content` 내용만 가져오게 된다.

---

이번 구현에서는 항상 검색을 하기 때문에 Tool Calling은 없지만, Retriever 과정을 도구로 등록해두고 LLM에 도구 등록해두면 이후에 Agent가 Tool Calling을 통해 RAG를 수행하는 구조를 만들 수도 있다. 이러한 구조를 Agentic RAG라고도 한다.

## 참고

[[Tool Calling]]