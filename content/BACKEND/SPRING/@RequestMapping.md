---
created: 2026-08-14T18:08:55+09:00
notion-id: 30d737bad00c80efb438f02a157803af
---
`@RequestMapping`은 **HTTP 요청의 URL(경로)과 메서드(GET/POST 등)를 특정 컨트롤러(또는 메서드)에 매핑**해주는 애노테이션이다.

```java
@Controller
@RequestMapping("/springmvc/v3/members") // 공통 URL 
public class SpringMemberControllerV3 {

    private MemberRepository memberRepository = MemberRepository.getInstance();

    // @RequestMapping(value = "/new-form", method = RequestMethod.GET)
    @GetMapping("/new-form")
    public String newForm() {
        return "new-form";
    }

    // @RequestMapping(value = "/save", method = RequestMethod.POST)
    @PostMapping("/save")
    public String save(
            @RequestParam("username") String username,
            @RequestParam("age") int age,
            Model model) {

        Member member = new Member(username, age);
        memberRepository.save(member);

        model.addAttribute("memeber", member);
        return "save-result"; 
    }

    // @RequestMapping(method = RequestMethod.GET)
    @GetMapping
    public String members(Model model) {
        List<Member> members = memberRepository.findAll();

        model.addAttribute("members", members);
        return "members";
    }
}
```

- 이렇게 URL 경로와 메서드를 매핑할 수 있다. 해당 URL로 접속하면 매핑된 메서드가 자동으로 호출된다.
- `@RequestMapping`은 클래스/메서드 둘 다 붙일 수 있고 메서드 종류로 필터링을 할 수도 있다.
	- 메서드 종류로는 GET, POST, PUT, PATCH, DELETE가 있다.
	- 만약에 메서드 지정을 하지 않으면 HTTP 메서드 종류의 필터링 없이 해당 경로로 모두 매핑된다.
	- 클래스 레벨에 붙이게 되면 모든 매핑 URL의 공통 prefix(접두 경로)가 된다.
- 실제로는 `@RequestMapping(method = RequestMethod.GET)` 대신에 `@GetMapping`으로 축약형을 사용한다.
	- GET, POST, PUT, PATCH, DELETE 모두 `@XxxMapping` 형태의 축약형이 존재한다.

### 참고

[[@xxxMappings]]

[[@RequestParam]]