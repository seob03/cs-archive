---
created: 2026-03-04T18:34:00+09:00
notion-id: 319737bad00c80d4bcd9e4985f017fc3
---
```java
@Slf4j
@Controller
@RequestMapping("/spring")
public class SpringUploadController {

    @Value("${file.dir}")
    private String fileDir;

    @GetMapping("/upload")
    public String newFile() {
        return "upload-form";
    }

    @PostMapping("/upload")
    public String saveFile(@RequestParam String itemName,
                           @RequestParam MultipartFile file,
                           HttpServletRequest request
			              ) throws IOException {

        log.info("request={}", request);
        log.info("itemName={}", itemName);
        log.info("multipartFile={}", file);

        if (!file.isEmpty()) {
            String fullPath = fileDir + file.getOriginalFilename();
            log.info("파일 저장 fullPath={}", fullPath);
            file.transferTo(new File(fullPath));
        }

        return "upload-form";
    }
}
```

- 파라미터의 `@RequestParam MultipartFile file`가 핵심이다.
	- `<input type=”file” name=”file”>`로 올라온 파일을 스프링이 `MultipartFile`로 자동으로 바인딩해서 준다.
	- 내부 동작으로는 MultipartResolver가 요청을 파싱해서 준다.
- `@Value`는 프로퍼티나 환경변수에서 표현식을 읽어서 가져와준다.
	- 여기선 `application.properties`에 저장된 파일명을 가져왔다.
- `MultipartFile`의 주요 메서드
	- `file.getOrininalFilename()`: 업로드 파일명을 가져온다.
	- `file.transferTo(…)`: 파일 저장

### 참고

[[@Value]]