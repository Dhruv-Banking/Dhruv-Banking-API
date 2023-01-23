dev:
	@npm run dev

clean:
	rm -rf build/

_build:
	make clean
	npm run build
	mkdir build/public
	mkdir build/public/forgotPassword
	mkdir build/public/verifyEmail
	cp src/public/forgotPassword/forgotPasswordEmailHtml.html build/public/forgotPassword
	cp src/public/verifyEmail/verifyEmailHtml.html build/public/verifyEmail
	mkdir build/core/email/images
	cp src/core/email/images/"Dhruv BankingLongggggggggg.png" build/core/email/images
	cp src/core/email/images/DhruvBanking.png build/core/email/images
	cp src/.env build/
	cp src/cert.pem build/
	cp src/key.pem build/

start:
	@make _build
	node build/index.js