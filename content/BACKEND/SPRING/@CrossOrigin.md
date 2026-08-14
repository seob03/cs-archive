---
notion-id: 30d737bad00c805eb2f1ce57e63eabf1
---
**브라우저의 CORS 정책을 통과시키기 위해**, 특정 컨트롤러/메서드에 대해 **다른 Origin의 요청을 허용**하는 애노테이션이다. (프론트-백 분리할 때 자주 사용)

```java
@CrossOrigin(origins = "http://localhost:3000")
@GetMapping("/api/items")
public List<Item> items() { ... }
```