---
notion-id: 310737bad00c80b3a108eb312cd77e4b
---
`@RequestBody`는 **요청 바디(Body)에 담긴 데이터(JSON ⭐)** 를 **객체(DTO)로 자동 역직렬화(Deserialize)해서** 컨트롤러 파라미터로 넘겨주는 애노테이션이다. 즉, **쿼리 스트링/form-urlencoded가 아니라** application/json 같은 **Body 기반 요청 데이터**를 꺼내서 DTO 필드에 자동으로 채워준다.

```java
POST /members
Content-Type: application/json

{
  "name": "kim",
  "age": 20
}
```

```java
@PostMapping("/members")
@ResponseBody
public String create(@RequestBody MemberCreateRequest dto) {
    // dto.getName() == "kim"
    // dto.getAge()  == 20
    return "ok";
}
```

- `@ModelAttribute`의 경우에는 쿼리 형태만 바인딩이 가능하기 때문에 JSON 형태는 처리 불가능
- 따라서 JSON 형태를 DTO 필드에 채우기 위해서는 `@RequestBody`를 사용해야 한다.

### 참고

[[@ModelAttribute]]

[[DTO란]]

[[@ResponseBody]]