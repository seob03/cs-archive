---
notion-id: 30d737bad00c805a8fc1e47be766ea25
---
`@Controller`는 **스프링 MVC에서 “웹 요청을 받아서 뷰(View)를 반환하는 컨트롤러”** 임을 표시하는 애노테이션이다. ==(이 클래스의 메서드가 @RequestMapping, @GetMapping 같은 걸로 **URL 매핑 대상**이 된다)==

```java
@Controller
@RequestMapping("/springmvc/v3/members")
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

- `@Controller`가 붙은 클래스는 스프링이 자동으로 스프링 빈으로 등록한다.
	- `@Controller`는 내부적으로 `@Component` 계열이라서 **컴포넌트 스캔 대상**이 되고, 스캔되면 빈으로 등록된다.
- 스프링 MVC에서 애노테이션 기반 컨트롤러라고 인식한다.
	- `@Controller`가 붙은 타입을 RequestMappingHandlerMapping 구현체가 스캔하고, 그 안의 `@RequestMapping` 메서드를 핸들러 메서드로 등록한다.
- `@RequestMapping("/springmvc/v3/members")`처럼 겹치는 URL의 경우에는 클래스 레벨에 `@RequestMapping`을 작성해서 메서드 URL의 중복 부분을 분리하는 방법도 존재한다.
- 참고로 `@Controller`는 기본이 **뷰 이름 반환**(String → ViewResolver), **바디(JSON)** 응답은 `@ResponseBody` 또는 `@RestController` 쪽이다.

### 참고

[[@RequestMapping]]

[[@RequestParam]]

[[@ResponseBody]]

[[@RestController]]