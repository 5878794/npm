// Hu不变矩 算法   没搞懂  也不晓得咋用




var HuMoment = function(imgData){
	let imgWidth = imgData.width,
		imgHeight = imgData.height,
		imgStep = 4*imgWidth;
	imgData = imgData.data;

	//中心矩
	let m00=0,
		m11=0,
		m20=0,
		m02=0,
		m30=0,
		m03=0,
		m12=0,
		m21=0;

	//计算中心距时所使用的临时变量（x-x'）
	let x0 = 0,
		y0 = 0;


	//规范化后的中心矩
	let u20=0,
		u02=0,
		u11=0,
		u30=0,
		u03=0,
		u12=0,
		u21=0;


	//HU不变矩
	let M = new Array(7);


	//临时变量
	let t1=0,
		t2=0,
		t3=0,
		t4=0,
		t5=0;


	// 重心
	let Center_x=0,
		Center_y=0;


	//  获得图像的区域重心(普通矩)
	//0阶矩和1阶矩
	let s10=0,
		s01=0,
		s00=0;

	for(let y=0,yl=imgHeight;y<yl;y++){
		for(let x=0,xl=imgWidth;x<xl;x++){
			s10 += x*imgData[y*imgStep+x];
			s01 += y*imgData[y*imgStep+x];
			s00 += imgData[y*imgStep+x];
		}
	}
	Center_x = parseInt(s10/s00+0.5);
	Center_y = parseInt(s01/s00+0.5);


	//  计算二阶、三阶矩(中心矩)
	m00 = s00;
	for(let y=0,yl=imgHeight;y<yl;y++){
		for(let x=0,xl=imgWidth;x<xl;x++){
			x0=(x-Center_x);
			y0=(y-Center_y);
			m11+=x0*y0*imgData[y*imgStep+x];
			m20+=x0*x0*imgData[y*imgStep+x];
			m02+=y0*y0*imgData[y*imgStep+x];
			m03+=y0*y0*y0*imgData[y*imgStep+x];
			m30+=x0*x0*x0*imgData[y*imgStep+x];
			m12+=x0*y0*y0*imgData[y*imgStep+x];
			m21+=x0*x0*y0*imgData[y*imgStep+x];
		}
	}


	//  计算规范化后的中心矩: mij/pow(m00,((i+j+2)/2)
	let pow = Math.pow;
	u20=m20/pow(m00,2);
	u02=m02/pow(m00,2);
	u11=m11/pow(m00,2);
	u30=m30/pow(m00,2.5);
	u03=m03/pow(m00,2.5);
	u12=m12/pow(m00,2.5);
	u21=m21/pow(m00,2.5);

	//  计算中间变量
	t1=(u20-u02);
	t2=(u30-3*u12);
	t3=(3*u21-u03);
	t4=(u30+u12);
	t5=(u21+u03);

	//  计算不变矩
	M[0]=u20+u02;
	M[1]=t1*t1+4*u11*u11;
	M[2]=t2*t2+t3*t3;
	M[3]=t4*t4+t5*t5;
	M[4]=t2*t4*(t4*t4-3*t5*t5)+t3*t5*(3*t4*t4-t5*t5);
	M[5]=t1*(t4*t4-t5*t5)+4*u11*t4*t5;
	M[6]=t3*t4*(t4*t4-3*t5*t5)-t2*t5*(3*t4*t4-t5*t5);


	return M;
};




