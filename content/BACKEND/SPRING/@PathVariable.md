---
notion-id: 310737bad00c80909c12d00d5fedee54
---
`@PathVariable`은 **URL 경로 자체에 박힌 값(/posts/{id}의 id)을 메서드 파라미터로 꺼내서 바인딩**해주는 스프링 MVC 애노테이션이다.

```java
/**
 * 변수명이 같으면 생략 가능
 * -> @PathVariable("userId") String userId -> @PathVariable String userId
 */
@GetMapping("/mapping/{userId}")
public String mappingPath(@PathVariable("userId") String data) {
    log.info("mappingPath userId={}", data);
    return "ok";
}

/**
 * PathVariable 사용 - 다중
 */
@GetMapping("/mapping/users/{userId}/orders/{orderId}")
public String mappingPath(@PathVariable String userId, @PathVariable Long orderId) {
    log.info("mappingPath userId={}, orderId={}", userId, orderId);
    return "ok";
}
```

- 변수명이 같으면 애노테이션의 이름 옵션을 생략할 수 있다.
- URL 경로에 박힌 값 여러 개를 동시에 가져오는 것도 가능하다.

---

### **@PathVariable vs @RequestParam**

- **@PathVariable** (URL 경로 자체에서 가져오기)
	- ==`**특정 리소스(하나)를 딱 집어서 조회/수정/삭제할 때 쓴다.**`==
	- 예: ==`GET /posts/10`== (10번 게시글), ==`DELETE /posts/10`==
- **@RequestParam** (쿼리 스트링에서 가져오기)
	- ==`**목록 조회에서 필터, 검색, 페이징, 정렬 같은 옵션을 붙일 때 쓴다.**`==
	- 예: ==`GET /posts?keyword=spring&page=2&size=20&sort=latest`==

---

**@PathVariable** → 간단 사용 예시 코드

```java
package hello.springmvc.basic.requestmapping;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mapping/users")
public class MappingClassController {

    /**
     * 회원 목록 조회: GET `/users`
     * 회원 등록: POST `/users`
     * 회원 조회: GET `/users/{userId}`
     * 회원 수정: PATCH `/users/{userId}`
     * 회원 삭제: DELETE `/users/{userId}`
     */

    /**
     * GET /mapping/users
     */
    @GetMapping
    public String user() {
        return "get user";
    }

    /**
     * POST /mapping/users
     */
    @PostMapping
    public String addUser() {
        return "post user";
    }

    /**
     * GET /mapping/users/{userId}
     */
    @GetMapping("/{userId}")
    public String findUser(@PathVariable String userId) {
        return "get userId=" + userId;
    }

    /**
     * PATCH /mapping/users/{userId}
     */
    @PatchMapping("/{userId}")
    public String updateUser(@PathVariable String userId) {
        return "update userId=" + userId;
    }

    /**
     * DELETE /mapping/users/{userId}
     */
    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable String userId) {
        return "delete userId=" + userId;
    }
}
```

### 참고

[[@RequestParam]]